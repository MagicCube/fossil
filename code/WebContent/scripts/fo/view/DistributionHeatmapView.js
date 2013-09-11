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

    me.updateDataSet = function()
    {
        me.heatmapLayer.setData(me.dataSet, 1);
    };


    return me.endOfClass(arguments);
};
