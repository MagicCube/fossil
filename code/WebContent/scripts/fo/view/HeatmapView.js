$ns("fo.view");

$import("fo.view.MapView");

$include("fo.res.HeatmapView.css");

fo.view.HeatmapView = function()
{
    var me = $extend(fo.view.MapView);
    me.elementClass = "HeatmapView";
    var base = {};
    
    me.heatmapLayer = null;
    me.data = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };
    
    base.initLayers = me.initLayers;
    me.initLayers = function()
    {
        base.initLayers();
        me.initHeatmap();        
    };
    
    me.initHeatmap = function()
    {
        me.heatmapLayer = L.TileLayer.heatmap({
            radius: { value: 5, absolute: false },
            opacity: 1,
            gradient :
            {
                "0.1" : "blue",
                "0.3" : "rgb(0,255,255)",
                "0.5" : "green",
                "0.7" : "yellow",
                "0.8" : "red"
            }
        });
        me.map.addLayer(me.heatmapLayer);
    };
    
    me.setData = function(p_data, p_max)
    {
        me.data = p_data;
        me.heatmapLayer.setData(me.data, p_max);
    };

    return me.endOfClass(arguments);
};
