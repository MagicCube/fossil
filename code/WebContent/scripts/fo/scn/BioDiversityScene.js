$ns("fo.scn");

$import("fo.view.DistributionMapView");
$import("fo.view.LineChartView");
$import("fo.view.PieChartView");
$import("fo.util.GroupUtil");

fo.scn.BioDiversityScene = function()
{
    var me = $extend(mx.scn.Scene);
    me.autoFillParent = true;
    me.elementClass = "BioDiversityScene";
    var base =
    {};

    me.linechartdata = null;
    me.groupSwitchView = null;
    me.lineChartView = null;
    me.mapView = null;
    me.pieChartView = null;

    me.args =
    {};

    base.init = me.init;
    me.init = function(p_options)
    {
        var width = 1800;
        var height = 1012;
        if (width > fo.app.frame.width * 0.95)
        {
            width = fo.app.frame.width * 0.95;
        }
        if (height > fo.app.frame.height * 0.95)
        {
            height = fo.app.frame.height * 0.95;
        }
        me.frame =
        {
            width : width,
            height : height
        };
        base.init(p_options);

        me.initLineChartView();
        me.initDistributionMapView();
        me.initPieChartView();
    };

    me.initLineChartView = function()
    {
        var $line = $("<div id=linechart></div>");
        $(document.body).append($line);

        me.lineChartView = new fo.view.LineChartView(
        {
            $element : $line,
            frame :
            {
                right : 50,
                bottom : 50,
                width : 700,
                height : 320
            },
            onyearchanged : _lineChartView_onyearchanged
        });
        me.addSubview(me.lineChartView);
    };

    me.initPieChartView = function()
    {
        var $pie = $("<div id=padinfoview></div>");
        $(document.body).append($pie);

        me.pieChartView = new fo.view.PieChartView(
        {
            $element : $pie,
            frame :
            {
                left : 20,
                top : 20,
                height : 190,
                width : 700
            }
        });
        me.addSubview(me.pieChartView);
    };

    // initialize Distribution View
    me.initDistributionMapView = function()
    {
        // Create map container otherwise leaflet frame not shown correctly
        var $mapContainer = $("<div id=distmap></div>");
        $(document.body).append($mapContainer);

        // Define map object: mapView
        me.mapView = new fo.view.DistributionMapView(
        {
            id : "distmapview",
            $element : $mapContainer,
            defaultZoom : 1,
            frame :
            {
                left : 0,
                top : 0,
                height : me.frame.height,
                width : me.frame.width
            }
        });
        me.addSubview(me.mapView);
    };

    base.activate = me.activate;
    me.activate = function(args, isPoppedBack)
    {
        base.activate(args, isPoppedBack);

        // Test Args when clicking Chronline
         args = {"className": null , "yearSelected": 297.413};
        // Test Args when clicking groups
//        args =
//        {
//            "className" : 'Equisetoph',
//            "yearSelected" : null
//        };

        if (args.yearSelected != null)
        {
            args.yearSelected = (args.yearSelected).toFixed(3);
        }
        else
        {
            args.yearSelected = fo.diverCurve[0].ma;
        }

        me.args = args;
        console.log(args);

        if (!isPoppedBack)
        {
            console.log("fo.scn.BioDiversityScene is now activated.");
            console.log(args);
            
            $.ajax({
                url: $mappath("~/api/taxon/diversity/distribution"),
                data: {
                    className: me.args.className ? me.args.className : "",
                    yearSelected: me.args.yearSelected
                },
                context: { year: year }
            }).success(function(p_result)
            {
                console.log("- " + year);
                p_result.year = parseFloat(this.year);
                me.mapView.setDistributionMapData(p_result);
                
                
                me.pieChartView.polygonArea = me.mapView.getPolygonArea(); //must be former
                me.pieChartView.setPieChartData(p_result, me.args);
            });

            
            
            setTimeout(function()
            {
                me.lineChartView.loadLineChartData(args);
            }, 100);

        }
        else
        {
            // TODO the scene is activated when popped back after the user
            // pressed 'Back' button.
        }
    };

    // Event Function Handler at scene level, update the relevant views.
    function _lineChartView_onyearchanged(year)
    {
        me.args.yearSelected = year;
//        console.log("+ " + year);
        $.ajax({
            url: $mappath("~/api/taxon/diversity/distribution"),
            data: {
                className: me.args.className ? me.args.className : "",
                yearSelected: me.args.yearSelected
            },
            context: { year: year }
        }).success(function(p_result)
        {
//            console.log("- " + year);
            p_result.year = parseFloat(this.year);
            me.mapView.setDistributionMapData(p_result);

            me.pieChartView.polygonArea = me.mapView.getPolygonArea();
            me.pieChartView.setPieChartData(p_result, me.args);

        }).fail(function(A, B, C){
            console.log("ERROR", A, B, C);
        });
    }
    
    me.deactivate = function()
    {
    	me.lineChartView.reset();
    };
    
    
    return me.endOfClass(arguments);
};
