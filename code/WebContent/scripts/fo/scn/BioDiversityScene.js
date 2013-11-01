$ns("fo.scn");

$import("fo.view.DistributionMapView");
$import("fo.view.LineChartView");
$import("fo.view.PieChartView");
$import("fo.util.GroupUtil");


fo.scn.BioDiversityScene = function(){
    var me = $extend(mx.scn.Scene);
    me.autoFillParent = true;
    me.elementClass = "BioDiversityScene";
    var base = {};
    
    me.linechartdata = null;
    me.groupSwitchView = null;
    me.lineChartView = null;
    me.mapView = null;
    me.pieChartView = null;
    
    me.args = {};

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
        me.frame = { width: width, height: height };
        base.init(p_options);
                  
        me.initLineChartView();
        me.initDistributionMapView();
        me.initPieChartView();
    };
	
    me.initLineChartView = function()
    {
    	var $line = $("<div id=linechart></div>");
    	$(document.body).append($line);
    	
    	
    	me.lineChartView = new fo.view.LineChartView({
       		$element:$line,
            frame: {
                right: 50,
                bottom: 50,
                width: 700,
                height: 300
            },
            onyearchanged: _lineChartView_onyearchanged
    	});
    	me.addSubview(me.lineChartView);
    };
	
    me.initPieChartView = function()
    {
    	var $pie = $("<div id=padinfoview></div>");
    	$(document.body).append($pie);
    	
    	me.pieChartView = new fo.view.PieChartView({
       		$element:$pie,
       	    frame: {
                    left: 20,
                    top: 20,
                    height: 190,
                    width: 700
                }
    	});
    	me.addSubview(me.pieChartView);
    };
        

    //initialize Distribution View
	me.initDistributionMapView = function()
	{
        //Create map container otherwise leaflet frame not shown correctly
        var $mapContainer = $("<div id=distmap></div>");
        $(document.body).append($mapContainer);

        //Define map object: mapView
        me.mapView = new fo.view.DistributionMapView({
        	id:"distmapview",
        	$element:$mapContainer,
        	defaultZoom: 1,
            frame: {
                left: 0,
                top: 0,
                height: me.frame.height,
                width: me.frame.width
            }
        });
        me.addSubview(me.mapView);
 	};  

    base.activate = me.activate;
    me.activate = function(args, isPoppedBack)
    {
        base.activate(args, isPoppedBack);
        

        //Test Args when clicking Chronline
//       args = {"className": null ,  "yearSelected": 270};
        //Test Args when clicking groups
//        args = {"className": 'Brachiopod', "yearSelected": null};

        if (args.yearSelected != null)
        {
        	args.yearSelected = Math.round(args.yearSelected);
        }
        else
        {
        	args.yearSelected = 298;
        }
      
        me.args = args;
       console.log(args);
        
        if (!isPoppedBack)
        {
            console.log("fo.scn.BioDiversityScene is now activated.");
     
             
            me.mapView.loadDistributionMapData(args); 

            me.pieChartView.polygonArea = me.mapView.getPolygonArea();
            me.pieChartView.loadPieChartData(args);
            
            setTimeout(function()
            {
                me.lineChartView.loadLineChartData(args);
            }, 100);
            
        }
        else
        {
            // TODO the scene is activated when popped back after the user pressed 'Back' button.
        }
    };

    
    //Event Function Handler at scene level, update the relevant views.
    function _lineChartView_onyearchanged(year)
    {
    
   	   me.args.yearSelected = year;
   	   me.mapView.loadDistributionMapData(me.args);
       me.pieChartView.polygonArea = me.mapView.getPolygonArea();
       me.pieChartView.loadPieChartData(me.args);
    	
    }
     
//  //GroupSwitchView To be moved to Chronline Scene
//	me.initGroupSwitchView = function()
//	{
//		me.groupSwitchView = new fo.view.GroupSwitchView({
//        	id : "groupswitchview",
//        	frame: {
//                right: 50,
//                top: 100
//            }
//        });
//    	//Register MXEvent for the scene/view and add event handler function to listeners for execution
//        me.addSubview(me.groupSwitchView);
//	};
    return me.endOfClass(arguments);
};
