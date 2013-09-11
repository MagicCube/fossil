$ns("fo");

$import("fo.BaseApp");
$import("fo.scn.DiversityScene");

fo.DiversityApp = function()
{
    var me = $extend(fo.BaseApp);
    me.homeSceneName = "Diversity";
    var base = {};

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };

    return me.endOfClass(arguments);
};
