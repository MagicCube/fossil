Segment = function(a, b)
{
	this.a = a;
	this.b = b;
};

/**
 * Generate a Polygon from an array of Point objects or coordinate pairs.
 * Polygon has:
 * - vertices Point;
 * - sides Point[].
 */
Polygon = function(points)
{
	this.vertices = points;

	this.sides = [];

	for (var i = 0; i < this.vertices.length; i++) 
		this.sides[i] = (i == this.vertices.length - 1) ?
			new Segment(this.vertices[i], this.vertices[0]) :
			new Segment(this.vertices[i], this.vertices[i+1]);
};

/**
 * Checks whether the point is included in Polygon (ray/perimeter intersections % 2)
 */
Polygon.prototype.contains = function(point)
{
	var intersections = 0;
	var outsidePoint = {
		lng: Math.min.apply(Math,this.vertices.map(function(o){return o.lng;})) - 0.01,
		lat: Math.min.apply(Math,this.vertices.map(function(o){return o.lat;})) - 0.01
	};

	var ray = new Segment(point, outsidePoint);

	for (var i = 0; i < this.sides.length; i++) {

		if (checkIntersection(ray, this.sides[i]))
			intersections ++;
	}

	return (intersections % 2);	
};

/**
 * Checks whether two segments intersect (ccw three-points)
 */
checkIntersection = function(segment1, segment2)
{
	var ccw = function(a, b, c) {
		return (c.lat-a.lat)*(b.lng-a.lng) > (b.lat-a.lat)*(c.lng-a.lng);
	};
	return ccw(segment1.a,segment2.a,segment2.b) != ccw(segment1.b,segment2.a,segment2.b) 
		&& ccw(segment1.a,segment1.b,segment2.a) != ccw(segment1.a,segment1.b,segment2.b);
};

