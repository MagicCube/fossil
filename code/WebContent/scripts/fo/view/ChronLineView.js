$ns("fo.view");

$include("fo.res.ChronLineView.css");

fo.view.ChronLineView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "ChronLineView";
    var base = {};
 
   // me.start = 297.889;
   // me.end = 258.333;
    me.start = fo.first;
    me.end = fo.last;
    me.data = [];
    
    me.moveLeft = 150;
    
    me.scale = null;
    
    var _$table = null;
    var _xScale = [];
    

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.$element.append("<div id=cover class=cover></div>");

        _$table = $("<table id=chronTable cellpadding=0 cellspacing=0></table>");
        _$table.append("<tr id=system><td width=110>System/<br>Period</td><td width=40><hr></td><td></td></tr>");
        _$table.append("<tr id=series><td>Series/<br>Epoch</td><td><hr></td><td></td></tr>");
        _$table.append("<tr id=stage><td>Stage/<br>Age</td><td><hr></td><td></td></tr>");
        _$table.append("<tr id=numerical><td>Numerical<br>age (Ma)</td><td><hr></td><td></td></tr>");
        
        me.$element.append(_$table);
                
        me.initTimeLineScale();
        me.initTimeLabels();
        me.initDiversityLine();
        me.initTimeLines();
        me.initSystem();
        me.initSeries();
        me.initStages();             

        
    };
    
    me.setViewWidth = function(p_width)
    {
    	me.frame.width = 2930;
    };
    
    me.initTimeLineScale = function()
    {
    	me.scale = d3.scale.linear()
    				.domain([0, me.frame.width - me.moveLeft])
    				.range([me.start, me.end]);
    	  	  
    };
    
    me.initSystem = function()
    {
    	var $system = me.$element.find("tr#system td:last-child");
    	$system.append("<div class='systemLabel label'>Permian</div>");
    };
    
    me.initSeries = function()
    {
    	var first = fo.util.ChronUtil.getChron(me.start).seriesIndex;
    	var last = fo.util.ChronUtil.getChron(me.end).seriesIndex;
    	var $stage = me.$element.find("tr#series td:last-child");
    	var colors= ["rgba(255, 121, 90, 0.25)", "rgba(255, 174, 100, 0.25)", "rgba(255, 250, 90, 0.25)"];
    	
/*    	var svg = d3.select("#chronLineView")
		.append("svg")
		.attr("class", "seriesLine")
		.attr("width", me.frame.width)
		.attr("height", 1080 );*/
    	
    	
    	for (var i = first; i <= last; i++)
    	{
    		var series = fo.util.ChronUtil.series[i];
    		var left = 0; 
    		var right = 0;
    		if (i == first)
			{
    			left = 0;
			}
    		else
			{
    			left = me.scale.invert(series.range[1]);
			}
    		
    		 		
    		if (i == last)
			{
    			right = me.frame.width - me.moveLeft;
			}
    		else
			{
    			right = me.scale.invert(series.range[0]);
			}
    		
    		var $div = $("<div class='label seriesLabel'>" + series.name + "</div>");
    		$div.css({
    			background: colors[i],
    			left: left,
    			width: right - left - 2
    		});
    		$stage.append($div);
    		
/*    		var mLeft = left + 150;
        	var svg = d3.select("body")
    		.append("svg")
    		.attr("class", "seriesLines")
    		.attr("width", 5)
    		.attr("height", 1080 );
    		

        	
    		svg.append("svg:line")
				.attr("x1", left + 150)
				.attr("y1", 0)
				.attr("x2", left + 150)
				.attr("y2", 1080)
				.style("stroke", "rgba(255, 255, 255, 0.1)")
				.style("stroke-width", "2px");*/
    		
    		var divid = "svg"+i;
    		var svg = d3.select(me.$container.get(0))
						.append("svg")
						.attr("id", divid)
						.attr("class","seriesLines");

//    		$("#" + divid).css("left", left + 150 -2 );
    		me.$element.find("#" + divid).css("left", left + me.moveLeft - 1 );
    		
        	svg.append("rect")
			   .attr("x", 0)
			   .attr("y", 0)
			   .attr("width", 2)
			   .attr("height", 1080)
			   .attr("fill","rgba(255,255,255,0.1)");
    		    		
    	}
    	
    };
    
    me.initStages = function()
    {
    	var first = fo.util.ChronUtil.getChron(me.start).stageIndex;
    	var last = fo.util.ChronUtil.getChron(me.end).stageIndex;
    	var $stage = me.$element.find("tr#stage td:last-child");
    	var currentSeries = fo.util.ChronUtil.series[0];
    	var colorIndex = -1;
    	var colors = ["rgba(255,177,164,0.2)", "rgba(211,167,132,0.2)", "rgba(234,229,146,0.2)"];
    	
    	for (var i = first; i<= last; i++)
    	{   		
    		var stage = fo.util.ChronUtil.stages[i];
    		var left = 0; // bigger absolute number
    		var right = 0;
    		var color = null;
    		
    		if (i == first)
			{
    			left = 0;
			}
    		else
			{
    			left = me.scale.invert(stage.range[1]);
			}
    		
    		
    		
    		if (i == last)
			{
    			right = me.frame.width - me.moveLeft;
			}
    		else
			{
    			right = me.scale.invert(stage.range[0]);
			}
    		
    		if(currentSeries == fo.util.ChronUtil.getChron(stage.range[0] + 1).series)
    		{
    			
    		}
    		else
    		{
    			currentSeries = fo.util.ChronUtil.getChron(stage.range[0] + 1).series;
    			colorIndex ++;
    		}
    		
    		color = colors[colorIndex];
    		
    		var $div = $("<div class='label stageLabel'>" + stage.name + "</div>");
    		$div.css({
    			background: color,
    			left: left,
    			width: right - left - 2
    		});
    		$stage.append($div);

    	}
    };
    
    me.initTimeLabels = function()
    {
    	var $td = me.$element.find("tr:last-child td:last-child");
    	var a = Math.floor(me.start);
    	var b = Math.floor(me.end); 
    	for(var i= b+1; i<= a; i++)
    	{    		  		
    		$div = $("<div class='label numericallabel'><span>"+ i +"</span></div>");
    		$div.css("left", me.scale.invert(i) -1);
    		_xScale.push(me.scale.invert(i));  		
    		$td.append($div);
    	}
    	
    };
    
    me.initTimeLines = function()
    {
    	var svg = d3.select(me.$container.get(0))
        			.append("svg")
        			.attr("class", "timeLine")
        			.attr("width", me.frame.width)
        			.attr("height", 135 );

    	for (var i = 0; i < _xScale.length; i++)
    	{
    		
    		 svg.append("svg:line")
				.attr("x1", _xScale[i] + me.moveLeft)
				.attr("y1", 0)
				.attr("x2", _xScale[i] + me.moveLeft)
				.attr("y2", 135)
				.style("stroke", "rgba(255, 255, 255, 0.1)")
				.style("stroke-width", "1px");

    	}
    };
    
    
    me.initDiversityLine = function()
    {
    	me.data = [{year: 297.889, value: 55},
    	           {year: 295, value: 81},
    	           {year: 291, value: 138},
    	           {year: 288, value: 38},
    	           {year: 285, value: 10},
    	           {year: 282, value: 190},
    	           {year: 279, value: 95},
    	           {year: 274, value: 18},
    	           {year: 269, value: 187},
    	           {year: 266, value: 50},
    	           {year: 262, value: 10},
    	           {year: 258.333, value: 40}
    	           ];
    	
    	var yHeight = 135;
    	
	    var y = d3.scale.linear()
	    			.domain([0, yHeight ])
	        		.range([195, 0]);
	
	    var line = d3.svg.line()
	        .x(function(d) { return me.scale.invert(d.year) + me.moveLeft; })
	        .y(function(d) { return y.invert(d.value) ; })
	        .interpolate("cardinal");
	
	    var svg = d3.select(me.$container.get(0)).append("svg")
	        			.attr("width", me.frame.width)
	        			.attr("height", yHeight)
	        			.attr("class","linechart");

	      
	    svg.append("path")
	          .datum(me.data)
	          .attr("class", "diverLine")
	          .attr("d", line);
	      
	    svg.selectAll("circle")  
	     	.data(me.data)
	     	.enter() 
	     	.append("circle") 
	         .attr("stroke", "white")
	         .attr("fill", function(d, i) { return "rgba(255, 255, 255, 0.2)" ;})
	         .attr("cx", function(d, i) { return me.scale.invert(d.year) + me.moveLeft; })
	         .attr("cy", function(d, i) { return y.invert(d.value); })
	         .attr("r", function(d, i) { return 1; });
	      
    };


    return me.endOfClass(arguments);
};