$ns("fo.view");

$import("fo.view.MapView");

$include("fo.res.DistributionMapView.css");

fo.view.DistributionMapView = function()
{
    var me = $extend(fo.view.MapView);
    var base = {};

    var _sectionCircleGroup = null;
    var _sectionPolygon = null;

    var _maxCircleRadius = 100000;
    var _maxTaxon = 200;

    var _$layerSwitcher = null;

    me.activeLayer = "";
    me.polygonLayer = "polygon";
    me.bubbleLayer = "bubble";
    me.sectionsByYear = null; // complete recordset;
    me.selectedSectByYear = []; // new recordset

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);

        me.initCircleGroup();

        // draw cycles with radius 0 by default
        me.activeLayer = me.bubbleLayer;
        me.initLayerSwitcher();
    };

    me.initCircleGroup = function()
    {
        _sectionCircleGroup = L.layerGroup().addTo(me.map);
        for ( var i = 0; i < fo.sections.length; i++)
        {
            var circle = L.circle(fo.sections[i].location, 0,
            {
                stroke : false,
                color : '#d8e214',
                fillcolor : '#d8e214',
                fillOpacity : 0,
                weight : 0
            });
            _sectionCircleGroup.addLayer(circle);
            _sectionCircleGroup[fo.sections[i].id] = circle;
        }
    };

    me.initLayerSwitcher = function()
    {
        _$layerSwitcher = $("<div class='viewSwitcher'><ul><li id='bubble'>Bubble</li><li id='polygon'>Polygon</li></ul></div>");
        _$layerSwitcher.on("click", _switcher_onclick);
        me.$element.append(_$layerSwitcher);

        me.$element.find("#" + me.activeLayer).addClass("selected");
    };

    function _switcher_onclick(e)
    {
        me.activeLayer = e.target.id;
        me.$element.find(".selected").removeClass("selected");
        if (me.activeLayer != null)
        {
            me.$element.find("#" + me.activeLayer).addClass("selected");
        }
        _toggleLayer();
    }
    ;

    // Clear previous layer and update new one
    function _toggleLayer()
    {
        if (me.activeLayer == me.polygonLayer)
        {
            // switch to polygon view
            _resetRadius();
            me.activeLayer = me.polygonLayer;
            _updatePolygon();
        }
        else
        {
            if (_sectionPolygon != null)
                me.map.removeLayer(_sectionPolygon);
            me.activeLayer = me.bubbleLayer;
            _updateCircles();
        }
    }
    ;

    // Used when operating over the curve
//    me.loadDistributionMapData = function(args)
//    {
        // First loading
        // if (me.sectionsByYear == null)
        // {
        // me.sectionsByYear = [];
        //    		
        // me.activeLayer = me.bubbleLayer;
        // me.$element.find("#" + me.activeLayer).addClass("selected");

        // me.selectedSectByYear = [{sectionID: "s142", taxonNumber: 20},
        // {sectionID: "s143", taxonNumber: 5}, {sectionID: "s145", taxonNumber:
        // 5}, {sectionID: "s149", taxonNumber: 5}, {sectionID: "s150",
        // taxonNumber: 5}];
        // }

        // TEST_DATA, should be fetched with args.yearSelected and come to
        // selectedSectByYear
        // var newDataset = null;
        // if (Math.random()>0.5)
        // {
        // newDataset = [{sectionID: "s142", taxonNumber: 20}, {sectionID:
        // "s143", taxonNumber: 5}, {sectionID: "s145", taxonNumber: 5},
        // {sectionID: "s149", taxonNumber: 5}, {sectionID: "s150", taxonNumber:
        // 5}];
        // }
        // else
        // {
        // newDataset = [{sectionID: "s142", taxonNumber: 4}, {sectionID:
        // "s143", taxonNumber: 15}, {sectionID: "s145", taxonNumber: 8},
        // {sectionID: "s150", taxonNumber: 3}, {sectionID: "s183", taxonNumber:
        // 15}];
        // }

//        if (me.activeLayer == me.bubbleLayer)
//        {
//            _resetRadius();
//            _updateCircles();
//        }
//        else
//        {
//            _updatePolygon();
//        }
//    };

    me.setDistributionMapData = function(p_data)
    {
        me.selectedSectByYear = p_data.sections;
        if (me.activeLayer == me.bubbleLayer)
        {
            _resetRadius();
            _updateCircles();
        }
        else
        {
            _updatePolygon();
        }
        
    };

//    function _loadDistByClassYear(args)
//    {
//        if (args.className == null)
//            args.className = "";
//        $.ajax(
//        {
//            url : "/fossil/api/taxon/diversity/distribution",
//            data :
//            {
//                className : args.className,
//                yearSelected : args.yearSelected
//            },
//            async : false
//        }).success(function(dist)
//        {
//            me.selectedSectByYear = dist["sections"];
//        });
//    }
//    ;

    // update cycles' radius whose number per year is larger than zero
    function _updateCircles()
    {
        if (me.selectedSectByYear == null)
        {
            return;
        }
        else
        {
            var sectionID; // section id
            var taxonNumber; // taxon total by section id

            // update Radius of relevant selectedSectByYear
            for ( var i = 0; i < me.selectedSectByYear.length; i++)
            {
                sectionID = me.selectedSectByYear[i].sectionId;
                taxonNumber = me.selectedSectByYear[i].count;
                if (taxonNumber != 0 && taxonNumber != null)
                {
                    if (taxonNumber > _maxTaxon)
                    {
                        taxonNumber = _maxTaxon;
                    }

                    _sectionCircleGroup[sectionID].setRadius(taxonNumber / _maxTaxon * _maxCircleRadius); // set
                                                                                                            // Radius
                                                                                                            // by
                                                                                                            // taxon
                                                                                                            // number
                    _sectionCircleGroup[sectionID].setStyle(
                    {
                        "fillOpacity" : 0.5
                    });
                }
            }
        }
    }
    ;

    // Clear previous radius
    function _resetRadius()
    {
        for ( var i = 0; i < fo.sections.length; i++)
        {
            sectionID = fo.sections[i].id;
            _sectionCircleGroup[sectionID].setRadius(0);
        }
    }
    ;

    // Create Polygon
    function _updatePolygon()
    {
        if (_sectionPolygon != null)
            me.map.removeLayer(_sectionPolygon);

        _sectionPolygon = _getConvexPolygon();
        
        if (_sectionPolygon == null) 
        	return;
        me.map.addLayer(_sectionPolygon);
        
    }
    ;

    function _getConvexPolygon()
    {
    	if (me.selectedSectByYear == null || me.selectedSectByYear.length < 3)
        {
            return null;
        }
        else
        {

            var sectionID = null;
            var latlngs = [];

            // update Radius of relevant selectedSectByYear
            for ( var i = 0; i < me.selectedSectByYear.length; i++)
            {
                sectionID = me.selectedSectByYear[i].sectionId;
                latlngs.push(fo.sections[sectionID].location);
            }

            var convexPolygon = new Polygon(latlngs).getConvexPolygon();
            return L.polygon(convexPolygon.vertices,
            {
                fillColor : '#d8e214',
                color : '#d8e214',
                fillOpacity : 0.5,
                opacity : 0.5,
                weight : 0

            });
        }
    }
    ;

    // calculate Area
    me.getPolygonArea = function()
    {
        var PointX = [];
        var PointY = [];

        var poly = _getConvexPolygon();

        if (poly == null)
        {
            return 0;
        }
        var vertices = poly.getLatLngs();

        for ( var i = 0; i < vertices.length; i++)
        {
            PointX.add(vertices[i].lat);
            PointY.add(vertices[i].lng);
        }
        
        var result = _calArea(PointX, PointY);
        console.log(result);
        
        if (isNaN(result) ) 
        {
        	return 0;
        }
        else
        {
        	return Math.round(result);
        }
    };

    function _calArea(PointX, PointY)
    {
        var MapUnits = "DEGREES";
        var Count = PointX.length;
        if (Count > 2)
        {
            var mtotalArea = 0;
            if (MapUnits == "DEGREES")
            {
                var LowX = 0.0;
                var LowY = 0.0;
                var MiddleX = 0.0;
                var MiddleY = 0.0;
                var HighX = 0.0;
                var HighY = 0.0;

                var AM = 0.0;
                var BM = 0.0;
                var CM = 0.0;

                var AL = 0.0;
                var BL = 0.0;
                var CL = 0.0;

                var AH = 0.0;
                var BH = 0.0;
                var CH = 0.0;

                var CoefficientL = 0.0;
                var CoefficientH = 0.0;

                var ALtangent = 0.0;
                var BLtangent = 0.0;
                var CLtangent = 0.0;

                var AHtangent = 0.0;
                var BHtangent = 0.0;
                var CHtangent = 0.0;

                var ANormalLine = 0.0;
                var BNormalLine = 0.0;
                var CNormalLine = 0.0;

                var OrientationValue = 0.0;

                var AngleCos = 0.0;

                var Sum1 = 0.0;
                var Sum2 = 0.0;
                var Count2 = 0;
                var Count1 = 0;

                var Sum = 0.0;
                var Radius = 6378000;

                for ( var i = 0; i < Count; i++)
                {
                    if (i == 0)
                    {
                        LowX = PointX[Count - 1] * Math.PI / 180;
                        LowY = PointY[Count - 1] * Math.PI / 180;
                        MiddleX = PointX[0] * Math.PI / 180;
                        MiddleY = PointY[0] * Math.PI / 180;
                        HighX = PointX[1] * Math.PI / 180;
                        HighY = PointY[1] * Math.PI / 180;
                    }
                    else if (i == Count - 1)
                    {
                        LowX = PointX[Count - 2] * Math.PI / 180;
                        LowY = PointY[Count - 2] * Math.PI / 180;
                        MiddleX = PointX[Count - 1] * Math.PI / 180;
                        MiddleY = PointY[Count - 1] * Math.PI / 180;
                        HighX = PointX[0] * Math.PI / 180;
                        HighY = PointY[0] * Math.PI / 180;
                    }
                    else
                    {
                        LowX = PointX[i - 1] * Math.PI / 180;
                        LowY = PointY[i - 1] * Math.PI / 180;
                        MiddleX = PointX[i] * Math.PI / 180;
                        MiddleY = PointY[i] * Math.PI / 180;
                        HighX = PointX[i + 1] * Math.PI / 180;
                        HighY = PointY[i + 1] * Math.PI / 180;
                    }

                    AM = Math.cos(MiddleY) * Math.cos(MiddleX);
                    BM = Math.cos(MiddleY) * Math.sin(MiddleX);
                    CM = Math.sin(MiddleY);
                    AL = Math.cos(LowY) * Math.cos(LowX);
                    BL = Math.cos(LowY) * Math.sin(LowX);
                    CL = Math.sin(LowY);
                    AH = Math.cos(HighY) * Math.cos(HighX);
                    BH = Math.cos(HighY) * Math.sin(HighX);
                    CH = Math.sin(HighY);

                    CoefficientL = (AM * AM + BM * BM + CM * CM) / (AM * AL + BM * BL + CM * CL);
                    CoefficientH = (AM * AM + BM * BM + CM * CM) / (AM * AH + BM * BH + CM * CH);

                    ALtangent = CoefficientL * AL - AM;
                    BLtangent = CoefficientL * BL - BM;
                    CLtangent = CoefficientL * CL - CM;
                    AHtangent = CoefficientH * AH - AM;
                    BHtangent = CoefficientH * BH - BM;
                    CHtangent = CoefficientH * CH - CM;

                    AngleCos = (AHtangent * ALtangent + BHtangent * BLtangent + CHtangent * CLtangent) / (Math.sqrt(AHtangent * AHtangent + BHtangent * BHtangent + CHtangent * CHtangent) * Math.sqrt(ALtangent * ALtangent + BLtangent * BLtangent + CLtangent * CLtangent));

                    AngleCos = Math.acos(AngleCos);

                    ANormalLine = BHtangent * CLtangent - CHtangent * BLtangent;
                    BNormalLine = 0 - (AHtangent * CLtangent - CHtangent * ALtangent);
                    CNormalLine = AHtangent * BLtangent - BHtangent * ALtangent;

                    if (AM != 0)
                        OrientationValue = ANormalLine / AM;
                    else if (BM != 0)
                        OrientationValue = BNormalLine / BM;
                    else
                        OrientationValue = CNormalLine / CM;

                    if (OrientationValue > 0)
                    {
                        Sum1 += AngleCos;
                        Count1++;

                    }
                    else
                    {
                        Sum2 += AngleCos;
                        Count2++;
                        // Sum +=2*Math.PI-AngleCos;
                    }

                }

                if (Sum1 > Sum2)
                {
                    Sum = Sum1 + (2 * Math.PI * Count2 - Sum2);
                }
                else
                {
                    Sum = (2 * Math.PI * Count1 - Sum1) + Sum2;
                }

                mtotalArea = (Sum - (Count - 2) * Math.PI) * Radius * Radius / 1000000 * 3;
            }
            else
            {

                var i;
                var j;
                var p1x, p1y;
                var p2x, p2y;
                for (i = Count - 1, j = 0; j < Count; i = j, j++)
                {

                    p1x = PointX[i];
                    p1y = PointY[i];

                    p2x = PointX[j];
                    p2y = PointY[j];

                    mtotalArea += p1x * p2y - p2x * p1y;
                }
                mtotalArea /= 2.0;
            }
            return mtotalArea;
        }
        return 0;
    }
    ;

    return me.endOfClass(arguments);
};
