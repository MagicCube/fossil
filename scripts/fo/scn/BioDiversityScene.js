$ns("fo.scn");

$import("fo.view.DistributionMapView");
$import("fo.view.LineChartView");
$import("fo.view.PieChartView");
$import("fo.util.GroupUtil");

$include("fo.res.BioDiversityScene.css");

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

        if(screen.availHeight != 1080)
        {
        	var rate = screen.availHeight / 1080;

        	me.$element.find("#padinfoview").css({"-webkit-Transform": "scale(" + rate + ")", "-webkit-Transform-Origin": "left top"});
        	me.$element.find(".viewSwitcher").css({"-webkit-Transform": "scale(" + rate + ")", "-webkit-Transform-Origin": "left bottom"});
        	me.$element.find("#linechart").css({"-webkit-Transform": "scale(" + rate + ")", "-webkit-Transform-Origin": "right bottom"});
        }
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
//         args = {"className": null , "yearSelected": 297.413};
        // Test Args when clicking groups
//        args =
//        {
//            "className" : 'Equisetoph',
//            "yearSelected" : null
//        };

        _UpdateArgsAndLineChartData(args); //set curve and update selectedYear

        if (!isPoppedBack)
        {
            console.log("fo.scn.BioDiversityScene is now activated.");
           // console.log(me.args);

            $.ajax({
                url: $mappath("~/api/taxon/diversity/distribution"),
                data: {
                    className: me.args.className ? me.args.className : "",
                    yearSelected: me.args.yearSelected
                },
                context: { year: me.args.yearSelected }
            }).success(function(p_result)
            {
                console.log("- " + year);
                p_result.year = parseFloat(this.year);
                me.mapView.setDistributionMapData(p_result);


                me.pieChartView.polygonArea = me.mapView.getPolygonArea(); //must be former
                me.pieChartView.setPieChartData(p_result, me.args);
            });


        }
        else
        {
            // TODO the scene is activated when popped back after the user
            // pressed 'Back' button.
        }
    };

    function _UpdateArgsAndLineChartData(args)
    {
    	//console.log(args);
    	if (args.className == null)
    	{
    		args.className = "";
    	}
    	else
    	{
    		args.className = args.className.trim();
    	}
    	$.ajax({
    		url: "/data/curve.json",
    		data: {class: args.className},
    		async: false
    	}).success(function(p_result)
    	{
		        if (args.yearSelected != null)
		        {
		            me.args.yearSelected = (args.yearSelected).toFixed(3);
		        }
		        else
		        {
		        	me.args.yearSelected = p_result[0].ma.toFixed(3);	//if year is not defined, get startyear from linechart and update yearselected
		        }
		        me.args.className = args.className;

		        setTimeout(function()
                    {
    					me.lineChartView.setCurveData(p_result);
    			        me.lineChartView.createLineChart(me.args);
                    }, 100);


   	});

     };


    me.deactivate = function()
    {
    	me.mapView.reset();
    	me.pieChartView.reset();
    	me.lineChartView.reset();
    };

    // Event Function Handler at scene level, update the relevant views.
    function _lineChartView_onyearchanged(year)
    {
        me.args.yearSelected = year;

        //console.log("+ " + year);
        $.ajax({
            url: $mappath("~/api/taxon/diversity/distribution"),
            data: {
                className: me.args.className ? me.args.className : "",
                yearSelected: me.args.yearSelected
            },
            context: { year: year }
        }).success(function(p_result)
        {
           // console.log("- " + year);
            p_result.year = parseFloat(this.year);
            me.mapView.setDistributionMapData(p_result);

            me.pieChartView.polygonArea = me.mapView.getPolygonArea();
            me.pieChartView.setPieChartData(p_result, me.args);

        }).fail(function(A, B, C){
            console.log("ERROR", A, B, C);
        });

    }

    return me.endOfClass(arguments);
};
