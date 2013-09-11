$ns("fo.view");

$import("fo.geo.Polygon");
$import("fo.view.GlobeView3D");

fo.view.DistributionGlobeView3D = function()
{
    var me = $extend(fo.view.GlobeView3D);
    me.maxLineLength = 1;
    var base = {};

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };
    
    me.activate = function()
    {
        me.startAnimation();
        me.updateDataSet();
    };
    
    me.deactivate = function()
    {
        me.stopAnimation();
    };
    
    
    me.updateDataSet = function()
    {
        me.data = [];
        var points = [];
        for (var i = 0; i < me.dataSet.length; i++)
        {
            var row = me.dataSet[i];
            if (row.value == 1)
            {
                points.add(row.location);
            }
        }
        var polygon = new fo.geo.Polygon({ vertices: points });
        polygon = polygon.getConvexPolygon();
        var bounds = polygon.getBounds();
        
        for (var y = bounds.y1; y <= bounds.y2; y += 0.6)
        {
            for (var x = bounds.x1; x <= bounds.x2; x += 0.6)
            {
                var point = {
                    lat: y,
                    lng: x
                };
                if (polygon.contains(point))
                {
                    me.data.add({
                        value: 1,
                        location: point
                    });
                }
            }
        }
        
        me.setData(me.data, 1);
        me.render();
    };
    
    me.colorScale = function(x)
    {
        var c = new THREE.Color();
        if (x == 0)
        {
            c.setRGB(0, 0, 0);
        }
        else
        {
            c.setRGB(0.2, 0.35, 1);
        }
        return c;
    };

    return me.endOfClass(arguments);
};
