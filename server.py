import os, hashlib, json, argparse, http.server, ssl
from http.server import SimpleHTTPRequestHandler
from urllib.parse import unquote
import toml
from pprint import pformat

class Config:
    def __init__(self, config_dict=None):
        config_dict = config_dict or toml.load("vulsrepo-config.toml")
        self._config = {k.lower(): Config(v) if isinstance(v, dict) else v for k, v in config_dict.items()}
    def __getattr__(self, name):return self._config.get(name.lower())
    __getitem__ = __getattr__
    def __repr__(self):return f'{self.__class__.__name__}({self._config})'
    def __str__(self):return pformat(self._config)

def create_authfile(path, realm, user):
    passwd = input("Password: ")
    with open(path, "a") as f:
        hash = hashlib.md5(f"{user}:{realm}:{passwd}".encode()).hexdigest()
        f.write(f"{user}:{realm}:{hash}\n")

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.path = self.path.replace("..", "")
        if self.path == "/":
            self.directory = self._config.Server.RootPath
        elif self.path.startswith("/results/"):
            self.directory = self._config.Server.ResultsPath
            self.path = self.path.lstrip("/results/")
        elif self.path.startswith("/getfilelist"):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            result = self.get_tree(self._config.Server.ResultsPath)
            self.wfile.write(json.dumps(result).encode())
            return
        else:
            if not any(map(lambda x:self.path.startswith(x), ["/dist/", "/plugins/", "/index.html"])):
                self.send_response(404)
                return

        super().do_GET()

    def get_tree(self, directory):
        tree = []
        try:
            entries = os.listdir(directory)
        except OSError as e:
            print(f"Access denied for {directory}: {e}")
            return tree

        for entry in entries:
            full_path = os.path.join(directory, entry)
            if os.path.isdir(full_path):
                children = self.get_tree(full_path)
                tree.append({"title": entry, "isFolder": "true", "children": children})
            else:
                tree.append({"title": entry, "url": "/"+full_path.lstrip(self._config.Server.ResultsPath)})
        return tree

def check_auth(user, realm, req):
    with open(args.c, "r") as hfile:
        for line in hfile:
            u, r, h = line.strip().split(':')
            if u == user and r == realm:
                received_hash = req.headers.get("Authorization").split(":")[2]
                valid_hash = hashlib.md5(f"{user}:{realm}:{req.client_address[1]}".encode()).hexdigest()
                return received_hash == valid_hash
    return False

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-m", action="store_true", help="make AuthFile")
    parser.add_argument("-c", default=os.path.expanduser("~/.htdigest"), help="AuthFile Path")
    parser.add_argument("-r", default="local", help="realm")
    parser.add_argument("-u", default="user", help="login user")
    args = parser.parse_args()

    if args.m:
        create_authfile(args.c, args.r, args.u)
    else:
        config = Config()
        handler = CustomHandler
        handler.directory = config.Server.RootPath
        setattr(handler, '_config', config)
        os.chdir(config.Server.RootPath)
        httpd = http.server.HTTPServer((config.Server.ServerIP, int(config.Server.ServerPort)), handler)
        
        if config.Server.ServerSSL == 'yes':
            httpd.socket = ssl.wrap_socket(httpd.socket, certfile=config.Server.ServerCert, keyfile=config.Server.ServerKey, server_side=True)
        
        print(f"Serving on {config.Server.ServerIP}:{config.Server.ServerPort}")
        httpd.serve_forever()

if __name__ == "__main__":
    main()

