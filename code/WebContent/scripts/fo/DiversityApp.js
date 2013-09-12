$ns("fo");

$import("fo.BaseApp");
$import("fo.scn.TaxonDiversityScene");

fo.DiversityApp = function()
{
    var me = $extend(fo.BaseApp);
    me.homeSceneName = "TaxonDiversity";
    var base = {};

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };

    return me.endOfClass(arguments);
};
