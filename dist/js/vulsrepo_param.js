var vulsrepo = {
    detailRawData: null,
    detailPivotData: null,
    timeOut: 300 * 1000,
    demoFlag: false,
    detailTaget: ["nvd", "jvn", "amazon", "redhat", "redhat_api", "ubuntu", "debian", "debian_security_tracker", "oracle", "trivy", "wpscan", "github"]
};


const vulsrepo_template = [{
        key: '01. Graph: CVSS-Severity => ServerName',
        value: '{"rendererOptions":{"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"}},"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"},"derivedAttributes":{},"aggregators":{},"renderers":{},"hiddenAttributes":[],"menuLimit":3000,"cols":["ServerName","Container"],"rows":["CVSS Severity"],"vals":[],"rowOrder":"key_a_to_z","colOrder":"value_z_to_a","exclusions":{},"inclusions":{},"unusedAttrsVertical":85,"autoSortUnusedAttrs":false,"aggregatorName":"Count","rendererName":"Stacked Bar Chart","inclusionsInfo":{}}'
    },
    {
        key: '02. Graph: CVSS-Severity => CVSS-Score',
        value: '{"rendererOptions":{"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"}},"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"},"derivedAttributes":{},"aggregators":{},"renderers":{},"hiddenAttributes":[],"menuLimit":3000,"cols":["CVSS Score"],"rows":["CVSS Severity"],"vals":[],"rowOrder":"key_a_to_z","colOrder":"key_a_to_z","exclusions":{},"inclusions":{},"unusedAttrsVertical":85,"autoSortUnusedAttrs":false,"aggregatorName":"Count","rendererName":"Stacked Bar Chart","inclusionsInfo":{}}'
    },
    {
        key: '03. Pivot: Package/CVSS-Severity/CveID/Summary => ServerName',
        value: '{"rendererOptions":{"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"}},"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"},"derivedAttributes":{},"aggregators":{},"renderers":{},"hiddenAttributes":[],"menuLimit":3000,"cols":["ServerName","Container"],"rows":["Packages","CVSS Severity","CveID","Changelog","Summary"],"vals":[],"rowOrder":"key_a_to_z","colOrder":"key_a_to_z","exclusions":{},"inclusions":{},"unusedAttrsVertical":85,"autoSortUnusedAttrs":false,"aggregatorName":"Count","rendererName":"Heatmap","inclusionsInfo":{}}'
    },
    {
        key: '04. Pivot: Package/CveID => ScanTime',
        value: '{"rendererOptions":{"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"}},"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"},"derivedAttributes":{},"aggregators":{},"renderers":{},"hiddenAttributes":[],"menuLimit":3000,"cols":["ScanTime"],"rows":["CveID","Packages","Changelog"],"vals":[],"rowOrder":"key_a_to_z","colOrder":"key_a_to_z","exclusions":{},"inclusions":{},"unusedAttrsVertical":85,"autoSortUnusedAttrs":false,"aggregatorName":"Count","rendererName":"Heatmap","inclusionsInfo":{}}'
    }, {
        key: '05. Pivot: CveID/PackageInfo => NotFixedYet',
        value: '{"rendererOptions":{"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"},"heatmap":{}},"localeStrings":{"renderError":"An error occurred rendering the PivotTable results.","computeError":"An error occurred computing the PivotTable results.","uiRenderError":"An error occurred rendering the PivotTable UI.","selectAll":"Select All","selectNone":"Select None","tooMany":"(too many to list)","filterResults":"Filter values","apply":"Apply","cancel":"Cancel","totals":"Totals","vs":"vs","by":"by"},"derivedAttributes":{},"aggregators":{},"renderers":{},"hiddenAttributes":[],"menuLimit":3000,"cols":["NotFixedYet"],"rows":["CveID","CVSS Severity","CVSS Score Type","Packages","DetectionMethod","PackageVer","NewPackageVer","Repository", "FixedIn", "FixState", "Changelog"],"vals":[],"rowOrder":"key_a_to_z","colOrder":"key_a_to_z","exclusions":{},"inclusions":{},"unusedAttrsVertical":85,"autoSortUnusedAttrs":false,"aggregatorName":"Count","rendererName":"Heatmap","inclusionsInfo":{}}'
    }
];

const vulsrepo_params = {
    vulsrepo_pivot_conf_tmp: "dictionary",
    vulsrepo_chkPivotSummary: "boolean",
    vulsrepo_chkPivotCvss: "boolean",
    vulsrepo_pivotPriority: "array",
    vulsrepo_pivotPriorityOff: "array",
    vulsrepo_chkCweTop25: "boolean",
    vulsrepo_chkOwaspTopTen2017: "boolean",
    vulsrepo_chkSansTop25: "boolean"
};

const vulsrepo_direct_params = {
    server: "string",
    daterange: "string",
    datefrom: "string",
    dateto: "string",
    time: "string"
};

const vulsrepo_date_range_params = {
    today: 'Today',
    yesterday: 'Yesterday',
    last7days: 'Last 7 Days',
    last30days: 'Last 30 Days',
    thismonth: 'This Month',
    lastmonth: 'Last Month',
    alldays: 'All Days'
}