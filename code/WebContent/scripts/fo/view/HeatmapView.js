$ns("fo.view");

$import("fo.view.MapView");

$include("fo.res.HeatmapView.css");

fo.view.HeatmapView = function()
{
    var me = $extend(fo.view.MapView);
    me.elementClass = "HeatmapView";
    var base = {};
    
    me.heatmapLayer = null;
    me.dataSet = null;

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
            radius: { value: 4, absolute: false },
            opacity: 0.8,
            gradient :
            {
                "0.2" : "rgb(0,0,255)",
                "0.4" : "rgb(0,255,255)",
                "0.6" : "rgb(0,255,0)",
                "0.75" : "yellow",
                "0.85" : "rgb(255,0,0)"
            }
        });
        me.map.addLayer(me.heatmapLayer);
    };
    
    me.setDataSet = function(p_dataSet, p_max)
    {
        me.dataSet = p_dataSet;
        me.heatmapLayer.setData(me.dataSet, p_max);
    };
    
    
    function _updateDataSet()
    {
        for (var i = 0; i < me.dataSet.length; i++)
        {
            var row = me.dataSet[i];
            row.value = Math.round(Math.random());
        }
    }
    
    function _playControlView_onpositionchanged(e)
    {
        _updateDataSet();
        me.heatmapLayer.setData(me.dataSet, 1);
    }

    return me.endOfClass(arguments);
};
