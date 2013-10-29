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
                right: 0,
                bottom: 0,
            },
            onyearchanged: _lineChartView_onyearchanged
    	});
    	me.addSubview(me.lineChartView);
    };
	
    me.initPieChartView = function()
    {
    	var $pie = $("<div id=piechart></div>");
    	$(document.body).append($pie);
    	
    	me.pieChartView = new fo.view.PieChartView({
       		$element:$pie,
       	    frame: {
                    left: 20,
                    top: 20,
                    height: 400,
                    width: 350
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
        	defaultZoom: 5,
            frame: {
                left: 0,
                top: 0,
                height: me.frame.height,
                width: me.frame.width
            }
        });
        me.addSubview(me.mapView);
 	};  
 	
//        ///////////////////////////////////////////////////////////////////////////
//        ///Get input of discovered sections on specific maYear based on test data//
//         	var sectionsByYear = [];
//         	window.setInterval(function ()
// 		   {
//     		for (var num = 0; num < fo.sections.length; num++)
//   				{
//     			sectionsByYear[num] = {"sectionID": fo.sections[num]["id"], "taxonNumber": Math.round(Math.random()*10)}; 
//   				};	
//	   			me.mapView.updateRadius(sectionsByYear);
// 		   }, 1000);


    base.activate = me.activate;
    me.activate = function(args, isPoppedBack)
    {
        base.activate(args, isPoppedBack);
        
        //Test Args when clicking Chronline
        me.args = {"className": null , "genusName": null, "yearSelected": 298};
        //Test Args when clicking groups
//        me.args = {"className": 'Brachiopod' , "genusName": null, "yearSelected": 298};
        
        
        if (!isPoppedBack)
        {
            console.log("fo.scn.BioDiversityScene is now activated.");
     
            me.lineChartView.loadLineChartData(me.args); 
            me.mapView.loadDistributionMapData(me.args); 

            me.pieChartView.polygonArea = me.mapView.getPolygonArea();
            me.pieChartView.loadPieChartData(me.args);
            
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
