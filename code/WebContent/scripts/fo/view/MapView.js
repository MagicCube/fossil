$ns("fo.view");

$import("lib.quadtree.QuadTree");
$import("lib.heatmap.Heatmap");
$import("lib.leaflet.Leaflet", function()
{
    $import("lib.leaflet.plugin.Heatmap");
    $import("lib.leaflet.plugin.Mapbox");
});

$include("lib.leaflet.leaflet.css");
$include("lib.leaflet.plugin.mapbox.css");
$include("fo.res.MapView.css");

fo.view.MapView = function()
{
    var me = $extend(mx.view.View);
    var base = {};
    
    me.map = null;
    me.$map = null;
    me.mapElement = null;
    
    
    me.baseTileUrl = "https://tiles.mapbox.com/v3/henryli.map-ccti13xw/{z}/{x}/{y}.png";
    
    
    me.defaultZoom = 4;
    me.defaultLocation = {lat: 35, lng: 108 };
    
    
    me.layers = [];
    me.layerSwitcher = null;
    
    

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.$element.addClass("MapView");
        
        me.$map = new $("<div class=Lmap>");
        me.mapElement = me.$map.get(0);
        me.$element.append(me.$map);
        
        me.initMap();
    };
    
    me.initMap = function()
    {
        me.map = L.mapbox.map(me.mapElement, "henryli.map-ccti13xw", {
            minZoom: 3,
            maxZoom: 10,
            zoomControl: false,
            attributionControl: false
        });
        window.Lmap = me.map;
        me.initLayers();
        me.zoomToDefault();
    };
    
    me.initLayers = function()
    {
        /*
        var baseLayer = L.tileLayer(
            me.baseTileUrl,
            {
                maxZoom: 18
            });
        me.addLayer(baseLayer, "osm,", "OSM", true, true);
        */
    };
    
    
    
    
    me.addLayer = function(p_layer, p_layerId, p_layerDisplayName, p_defaultVisibility, p_isBaseLayer)
    {
        me.layers.add(p_layer);
        me.layers[p_layerId] = p_layer;
        
        if (p_defaultVisibility != false)
        {
            me.map.addLayer(p_layer);
        }
    };
    
    me.removeLayer = function(p_layer)
    {
        if (isString(p_layer))
        {
            p_layer = me.layers[p_layer];
        }
        me.map.removeLayer(p_layer);
        me.layers.remove(p_layer);
    };
    
    
    
    
    me.zoomTo = function(p_center, p_zoom)
    {
        me.map.setView(p_center, p_zoom);
    };
    
    me.zoomToDefault = function()
    {
        me.zoomTo(me.defaultLocation, me.defaultZoom);
    };
    
    
    
    
    
    
    
    
    

    return me.endOfClass(arguments);
};
