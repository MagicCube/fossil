$ns("fo.view");

$import("fo.view.HeatmapView");


fo.view.DistributionHeatmapView = function()
{
    var me = $extend(fo.view.HeatmapView);
    var base = {};

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };
    
    me.activate = function()
    {
        me.updateDataSet();
    };

    me.updateDataSet = function()
    {
        me.setData(me.dataSet, 1);
    };
    
    me.reset = function()
    {
        me.zoomToDefault();
    };


    return me.endOfClass(arguments);
};
