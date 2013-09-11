$ns("fo.view");

$import("lib.cbrandolino.PointPolygon");
$import("lib.mgomes.ConvexHull");

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
        points.sort(sortPointY);
        points.sort(sortPointX);
        var hullPoints = [];
        chainHull_2D(points, points.length, hullPoints);
        var polygon = new L.Polygon(hullPoints);
        var bounds = polygon.getBounds();
        var x1 = bounds.getWest();
        var x2 = bounds.getEast();
        var y1 = bounds.getSouth();
        var y2 = bounds.getNorth();
        
        var polygon2 = new Polygon(hullPoints);
        
        for (var y = y1; y <= y2; y += 0.8)
        {
            for (var x = x1; x <= x2; x += 0.8)
            {
                var point = {
                    lat: y,
                    lng: x
                };
                if (polygon2.contains(point))
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
            c.setRGB(0.5, 0.5, 1);
        }
        return c;
    };

    return me.endOfClass(arguments);
};
