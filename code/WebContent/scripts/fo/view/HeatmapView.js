$ns("fo.view");

$import("fo.view.MapView");

$include("fo.res.HeatmapView.css");

fo.view.HeatmapView = function()
{
    var me = $extend(fo.view.MapView);
    me.elementClass = "HeatmapView";
    var base = {};
    
    me.playControlView = null;
    me.heatmapLayer = null;
    me.data = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        if (me.playControlView != null)
        {
            me.setPlayControlView(me.playControlView);
        }
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
            gradient: {
                "0.45": "rgb(0,0,255)",
                "0.55": "rgb(0,255,255)",
                "0.65": "rgb(0,255,0)",
                "0.95": "yellow",
                "1.0": "rgb(255,0,0)"
            }
        });
        me.map.addLayer(me.heatmapLayer);
        
        me.data = [];
        for (var i = 0; i < fo.sections.length; i++)
        {
            var section = fo.sections[i];
            var row = { lat: section.location.lat, lon: section.location.lng, value: 0 };
            me.data[section.id] = row;
            me.data.add(row);
        }        
    };
    
    me.setPlayControlView = function(p_playControlView)
    {
        if (me.playControlView != null)
        {
            me.playControlView.off("positionchanged", _playControlView_onpositionchanged);
            me.playControlView = null;
        }
        
        if (p_playControlView != null)
        {
            me.playControlView = p_playControlView;
            me.playControlView.on("positionchanged", _playControlView_onpositionchanged);
        }
    };
    
    
    
    function _playControlView_onpositionchanged(e)
    {
        for (var i = 0; i < me.data.length; i++)
        {
            var row = me.data[i];
            row.value = Math.random() * 50;
        }
        me.heatmapLayer.setData(me.data);
    }

    return me.endOfClass(arguments);
};
