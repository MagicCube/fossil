$ns("fo.view");

$include("fo.res.LineChartView.css");

fo.view.LineChartView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "LineChartView";
    var base = {};
    
    
    var _position = 0;	//where selector stays on the year axis
    
    var _dataset = null;
    var _svg = null;
    var _yearScale = null;
    var _numScale = null;
    var _yearSelected = null;
    var _minXValue = null;
    var _maxXValue = null;
    var _playing = false;
 
    me.onyearchanged = null;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        _initButtons();
    };
    
    function _initButtons()
    {
        _$playPause = $("<div id=playPause/>");
        _$playPause.on("click", _togglePlay);
        _$playPause.attr("style", "top:"+ (me.frame.height+me.frame.bottom)/2 + "px");
        me.$container.append(_$playPause);
    }    
    
    
   function _togglePlay()
    {
        if (_playing)
        {
            me.$container.addClass("paused").removeClass("playing");
        	_playing = false;
        }
        else 
        {
            me.$container.addClass("playing").removeClass("paused");
            _playing = true;
            _play();
            
        }
    };

    function _pause()
    {
        me.$container.addClass("paused").removeClass("playing");
    	_playing = false;
    }
    
    function _reset()
    {
    	_pause();
       	_position = _minXValue;
    	_selectYear(_position, true);
    }
    
    function _play()
    {
        if (_playing)
        {
        	if (_position > _maxXValue)
            {
                setTimeout(_play, 1000);
                _selectYear(--_position, true);	//trigger event
                return;
            }
         	else 	//if reaching the right limit, reset 
            {
         		_reset();
         		return;
            	
            }
        }
        else
        {
            console.log("paused");
        	return;
        }
    }
    
	//load received args to update the lineChart
	me.loadLineChartData = function (args)
    {
		// TODO process args to get dataset via backend interface
		if (args.yearSelected ==null) args.yearSelected = 298;

		//TEST DATA
		_dataset = [{ma: 298, count: 5}, {ma: 295, count: 10}, {ma: 290, count: 12}, {ma: 279, count: 7}, {ma: 272, count: 5}, {ma: 268, count: 20}, {ma: 265, count: 14}, {ma: 259, count: 15}, {ma: 254, count: 20}, {ma: 252, count: 4}].reverse();
		//_dataset = fo.diveCurve;
//		console.log(_dataset);
		
		var margin = {top: 20, right: 30, bottom: 20, left: 30},
    	width = me.frame.width;
    	height = me.frame.height;
	
    	//Build Scale according to received dataset
	    _yearScale = d3.scale.linear()
	    	.domain([_minXValue = d3.max(_dataset, function(d){return d.ma;}), _maxXValue = d3.min(_dataset, function(d){return d.ma;})])
	        .range([margin.left, width - margin.right]);
	
	    _numScale = d3.scale.linear()
	    	.domain([0, d3.max(_dataset, function(d){return d.count;})])
	        .range([height - margin.bottom, margin.top]);
	    
	    //Define Axis
	    var xAxis = d3.svg.axis()
	        .scale(_yearScale)
	        .orient("bottom")	//label's relative position
	        .ticks(10);
	    //console.log(_yearScale(298));
	    
	    var yAxis = d3.svg.axis()
	        .scale(_numScale)
	        .orient("right")
	        .ticks(5);

	    //Define Line Chart
	    if (_svg !=null) _svg.remove();
	    _svg = d3.select("#linechart").append("svg")
	        .attr("width", width)
	        .attr("height", height)
        	.attr("class","chart");
    
	    //Draw axis   
	    _svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + (height - margin.bottom ) + ")")
	        .call(xAxis);
	    _svg.append("g")
	    	.attr("class", "y axis")
	        .attr("transform", "translate(" +  (width - margin.right) + ", 0)")
	    	.call(yAxis);
	    	        

	     //Draw curves to show over the axis
		 var line = d3.svg.line()
		        .x(function(d) { return _yearScale(d.ma); })
		        .y(function(d) { return _numScale(d.count); })
		        .interpolate("basis");
	     _svg.append("path")
	    	.attr("class", "line")
	        .attr("d", line(_dataset));
	      
	      me.initSelectorHand(args);
	      
	      //Judge if need to play the animation depending on the trigger
	      d3.select("#linechart g.chart")
	  	    .on("mousemove", function() {
	  	      var c = d3.mouse(this);
	  	      _selectYearForPosition(c[0]);	//c[0] is where mouse is in the screen
	  	    });
	   	
	      _position = args.yearSelected; 
	      
    };    
    
    
    me.initSelectorHand = function(args)
    {
		
		_yearSelected = args.yearSelected;
    	
    	var circleRadious = 30;
    	var timelineHeight = me.frame.height;

    	var selectorHandHeight = Math.max(timelineHeight - 30, 60);
        var selectorHand = _svg.append("g")
        .attr("class", "selectorHand")
        .attr("transform", "translate("+(_yearScale(_yearSelected))+",0)");

      selectorHand.append("line")
        .attr("y1", timelineHeight - selectorHandHeight)
        .attr("y2", timelineHeight);


        var haloGradient = _svg.append("defs")
          .append("radialGradient")
            .attr({
              id : "selectorHandHalo",
              cx : "50%", cy : "50%", r : "50%", fx : "50%", fy : "50%"
            });

        haloGradient.append("stop")
          .attr({ offset: "0%", "stop-color": "#fff", "stop-opacity": "0.0" });

        haloGradient.append("stop")
          .attr({ offset: "35%", "stop-color": "#fff", "stop-opacity": "0.05" });

        haloGradient.append("stop")
          .attr({ offset: "80%",  "stop-color": "#fff", "stop-opacity": "0.23" });

        haloGradient.append("stop")
          .attr({ offset: "100%",  "stop-color": "#fff", "stop-opacity": "0.25" });

        
        selectorHand.append("circle")
        .attr("class", "center")
        .attr("cx", 0)
        .attr("cy", timelineHeight - selectorHandHeight)
        .attr("r", 4);

      selectorHand.append("circle")
        .attr("class", "halo")
        .attr("stroke-width", "0")
        .attr("opacity", "0.4")
        .attr("fill", "url(#selectorHandHalo)")
        .attr("cx", 0)
        .attr("cy", timelineHeight - selectorHandHeight)
        .attr("r", circleRadious);
      
      var selectorHandDrag = d3.behavior.drag()
      .origin(Object)
      .on("drag", _dragSelectorHand);

	  d3.select("#linechart .selectorHand")
	    .on("mouseover", function(){
	       d3.select(this).select("circle.halo")
	         .transition()
	           .duration(250)
	           .attr("opacity", "1.0");
	    })
	    .on("mouseout", function(){
	       d3.select(this).select("circle.halo")
	         .transition()
	           .duration(250)
	           .attr("opacity", "0.5");
	    })
	    .call(selectorHandDrag);
	
 	
 };
    
	  function _dragSelectorHand(d)
	  {
	    var c = d3.mouse(this.parentNode);   // get mouse position relative to its container
	    _selectYearForPosition(c[0]);
		 
	  }
    
	
    function _selectYearForPosition(cx) 
    {
	    var year = Math.round(_yearScale.invert(cx));
	    
	    if (Math.abs((_yearScale.invert(cx))-_position)<0.5 || year>_minXValue || year<_maxXValue)
	    {//small movement or mouse movement out of range doesn't trigger new selection
	    	console.log(year);
	    	return;
	    }	
	    
	    _selectYear(year, true);
	    _pause(); 
	    _position = year;
	  }
    
    function _selectYear(year, duration)
    {
    	  var r = d3.extent(_yearScale.domain());
    	  if (year < r[0]) year = r[0];
    	  if (year > r[1]) year = r[1];

    	  var t = d3.select("#BioDiversity")
    	    .transition()
    	      .ease("linear")
    	      .duration(duration);

    	  t.select("#linechart g.selectorHand")
    	    .attr("transform", "translate("+(_yearScale(year))+",0)");
    	  
     	  me.trigger("yearchanged", year);
 
    	}
    
//    //Throw event
//    function _setYearSelected(year)
//    {
//	  //reset year and throw setYearSelected event
//    }
    
    
    
    
    
    return me.endOfClass(arguments);
};
