$ns("fo.geo");

$import("lib.mgomes.ConvexHull");

$import("fo.geo.Segment");

fo.geo.Polygon = function()
{
    var me = $extend(MXObject);
    var base = {};
    
    me.vertices = null;
    me.sides = [];

    base._ = me._;
    me._ = function(p_options)
    {
        if (me.canConstruct())
        {
            base._(p_options);
            for (var i = 0; i < me.vertices.length; i++) 
            {
                me.sides[i] = (i == me.vertices.length - 1) ? new fo.geo.Segment({ a: me.vertices[i], b: me.vertices[0] }) : new fo.geo.Segment({ a: me.vertices[i], b: me.vertices[i + 1]});
            }
        }
    };

    me.contains = function(p_point)
    {
        var intersections = 0;
        var outsidePoint = {
            lng : Math.min.apply(Math, me.vertices.map(function(o)
            {
                return o.lng;
            })) - 0.1,
            lat : Math.min.apply(Math, me.vertices.map(function(o)
            {
                return o.lat;
            })) - 0.1
        };

        var ray = new fo.geo.Segment({ a: p_point, b: outsidePoint });

        for ( var i = 0; i < me.sides.length; i++)
        {
            if (_checkIntersection(ray, me.sides[i]))
            {
                intersections++;
            }
        }

        return (intersections % 2); 
    };
    
    me.getBounds = function()
    {
        var x1 = Math.min.apply(Math, me.vertices.map(function(o){ return o.lng; }));
        var x2 = Math.max.apply(Math, me.vertices.map(function(o){ return o.lng; }));
        var y1 = Math.min.apply(Math, me.vertices.map(function(o){ return o.lat; }));
        var y2 = Math.max.apply(Math, me.vertices.map(function(o){ return o.lat; }));
        return {
            x1: x1,
            x2: x2,
            y1: y1,
            y2: y2
        };
    };

    me.getConvexPolygon = function()
    {
        me.vertices.sort(sortPointY);
        me.vertices.sort(sortPointX);
        var hullPoints = [];
        chainHull_2D(me.vertices, me.vertices.length, hullPoints);
        return new fo.geo.Polygon({ vertices: hullPoints });
    };
    
    
    function _checkIntersection(segment1, segment2)
    {
        var ccw = function(a, b, c) {
            return (c.lat-a.lat)*(b.lng-a.lng) > (b.lat-a.lat)*(c.lng-a.lng);
        };
        return ccw(segment1.a,segment2.a,segment2.b) != ccw(segment1.b,segment2.a,segment2.b) 
            && ccw(segment1.a,segment1.b,segment2.a) != ccw(segment1.a,segment1.b,segment2.b);
    };

    return me.endOfClass(arguments);
};
