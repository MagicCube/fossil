$ns("fo.view");
$import("fo.view.DistributionMapView");

$include("fo.res.PieChartView.css");

fo.view.PieChartView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "PieChartView";
    var base = {}; 
    
    me.data = [];
    me.polygonArea = 0;
    
    var _width = 190;
    var _height = 200;
    var _radious = 90;
    var _tweenDuration = 100;
    var _textOffset = 30;
    var _totalValue = 0;
    var _totalCount = 0;
    
    var _color = d3.scale.ordinal().range(["#FFFF00","#8FED74","#79C0E0", "#791CBB","#F43D4F","#FF7F1F"]);   //0.45 OPACITY
    var _oldPieData = [];
    
    var _pie = null;
    var _arc = null;
    var _infopadview = null;
    var _svg = null;
    var _label_group = null;
    var _lines = null;
    
    var _filteredPieData = null;

    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);

        _pie = d3.layout.pie()
		.value(function(d) { return d.count; })
		.sort(null);
        
       	_infopadview = d3.select("#padinfoview");
       	
       	_infopadview.append("span")
       				.attr("id", "title");
       	
       	var div = _infopadview.append("div"); 
       	div.attr("id", "yearMA");
       	div.append("span")
       				.attr("id", "year");
       	div.append("span")
				    .attr("id", "ma");
       	
       	_infopadview.append("span")
					.attr("id", "taxacount");
       	_infopadview.append("span")
       				.attr("id", "area");
        		
       	//Create pie chart
       	_infopadview.append("span")
       				.attr("id", "proportion");
		_svg = _infopadview.append("svg");
		_infopadview.append("ul")
					.attr("id", "bullets");
		
		
    };
    
    
    function _loadDataByClassYear(args)
    {
    	if (args.className == null) args.className = "";
    	$.ajax({
    		url: "/fossil/api/taxon/diversity/distribution",
    		data: {className: args.className, yearSelected: args.yearSelected},
    		async: false
    	}).success(function(dist)
    	{
    		_totalCount = 0;
    		me.data = [];
    		
    		var classes = dist["classes"];
    		for (var i = 0; i < classes.length && i <= 5; i++)
    		{
    			if (i < 5)
    			{
    				me.data.add(classes[i]);
    				_totalCount += classes[i].count; 
    			}
    			if (i == 5)
    			{
    				var othersCount = 0;
    				for (var j = 5; j< classes.length; j++)
    				{
    					othersCount += classes[j].count;
    					_totalCount += classes[j].count; 
    				}
    				me.data.add({className: 'Others', count: othersCount});
    			}
			 };
    		
//    		console.log(me.data);
    	});
    };

    me.updateInfoPad = function(args)
    {
    	//TODO getClassTaxonCountJson (args.yearSelected)	§ Return DataSet:  [{className, count}]
//    	_loadDataByClassYear(args);
//    	if (Math.random()>0.5)
//    	{
//    		me.data = [{className: "Gastropoda", count: 2}, {className: "Cephalopod", count: 2}, {className: "Brachiopod", count: 2},  {className: "Cephalopod", count: 5}, {className: "Lophophyllum", count: 5}, {className: "Others", count: 5}];
//    	}
//    	else
//    	{
//        	me.data = [{className: "Gastropoda", count: 4}, {className: "Cephdddiopod", count: 7}];
//    	}

    	var classView  = (args.className == null||args.className == "")?false:true;
    	_infopadview.select("#title").text(classView?"Biological Diversity":args.className);
    	_infopadview.select("#year").text(Math.round(args.yearSelected));
    	_infopadview.select("#ma").text("million years ago");
    	_infopadview.select("#taxacount").text("Taxa Count: " + _totalCount);
    	_infopadview.select("#area").text("Area: " + me.polygonArea + "km²");

    	if (classView)
    	{
    		me.initPie();
    	}


        //remove old class proportion info list and create new one
      	var bullets = _infopadview.select("#bullets");
      	bullets.selectAll("li").remove();
     	_infopadview.selectAll("span.bullet").remove();
     	
      	var lis = bullets.selectAll("li")
      				.data(_filteredPieData)
      				.enter()
      				.append("li");
      	lis.append("span")
      	    .attr("class", "bullet")
      	    .style("background-color", function(d, i)
            {
      	        return _color(i);
  	        });
      	    
      	lis.append("span")
      	    .attr("class", "label")
    		.text(function(d, i)
            {   
    			 var percentage = (d.value/_totalValue)*100;
    			 return d.name + " " + percentage.toFixed(1) + "%";
    		});
    };

    me.initPie = function()
    {
		_totalValue = 0;	//reset to zero
    	_infopadview.select("#proportion").text("Class Proportion");
 		
		//initialize pie
        _filteredPieData = _pie(me.data).filter(_filterData);
    	var arcs = _svg.selectAll("g.arc")
			  .data(_filteredPieData);
//    	console.log(_filteredPieData);
    	
        //add extra arcs if new dataset is bigger
		_arc = d3.svg.arc().outerRadius(_radious);
		arcs.enter()
			  .append("g")
			  .attr("class", "arc")
			  .attr("transform", "translate(" + (_width/2) + "," + (_height/2) + ")")
		      .append("path")
			  .attr("d", _arc)
			  .attr("fill", function(d, i) {
					return _color(i);
				})
		      .each(function(d) { this._current = d;});		
	
    	//remove extra arcs if new dataset is smaller
    	arcs.exit().remove(); 

        var path = _svg.selectAll("g.arc path");
	    path.data(_filteredPieData);
	    path.transition().duration(_tweenDuration).attrTween("d", _arcTween); // redraw the arcs
     
    };
    
    function _arcTween(a) {
    	  var i = d3.interpolate(this._current, a);
    	  this._current = i(0);
    	  return function(t) {
    	    return _arc(i(t));
    	  };
    	}
    
    function _filterData(element, index, array) {
	  	  element.name = me.data[index].className;
	  	  element.value = me.data[index].count;
	  	  _totalValue += element.value;
	  	  return (element.value > 0);
 	}
   
    
    
    
    //*********************** BELOW NOT NEEDED ******************************************************/
    function _updatePie() 
    {
		_totalValue = 0;	//reset to zero
	      _filteredPieData = _pie(me.data).filter(_filterData);
	     // console.log(filteredPieData);

		  _arc = d3.svg.arc().outerRadius(_radious);
			arcs.append("path")
				.attr("d", _arc)
				.attr("fill", function(d, i) {
					return _color(i);
				})
		      .each(function(d) { this._current = d; console.log(d);});		
	      
	      var path = _svg.selectAll("g.arc path");
	      path.data(_filteredPieData);
	      path.transition().duration(_tweenDuration).attrTween("d", _arcTween); // redraw the arcs

	      
	      _oldPieData = _filteredPieData;
    }

    me.initLabel = function()
    {
       	//Create label group	
    	_svg.selectAll("g.label_group").remove();
       	
       	_label_group = _svg.append("svg:g")
    	.attr("class", "label_group")
    	.attr("transform", "translate(" + (_width/2) + "," + (_height/2) + ")");
    	
    	
      //PartI init classNames  
      nameLabels = _label_group.selectAll("text.cls").data(_filteredPieData);
      nameLabels.remove();
      nameLabels.transition().duration(_tweenDuration).attrTween("transform", _textTween);
      nameLabels.enter().append("svg:text")
        .attr("class", "cls")
        .attr("transform", function(d) {
          return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (_radious+_textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (_radious+_textOffset) + ")";
        })
        .attr("dy", function(d){
          if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
            return 5;
          } 
          else {
            return -7;
          }
        })
        .attr("text-anchor", function(d){
          if ((d.startAngle+d.endAngle)/2 < Math.PI*1.1) {
            return "beginning";
          } 
          else {
            return "end";
          }
        }).text(function(d){
          return d.name;
        });

  	//PartII init percentage values
      valueLabels = _label_group.selectAll("text.percent").data(_filteredPieData);
      valueLabels.remove();
      valueLabels.transition().duration(_tweenDuration).attrTween("transform", _textTween);
      valueLabels.enter().append("svg:text")
      .attr("class", "percent")
      .attr("transform", function(d) {
        return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (_radious+_textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (_radious+_textOffset) + ")";
      })
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
          return 17;
        } 
        else {
          return 5;
        }
      })
      .attr("text-anchor", function(d){
        if ( (d.startAngle+d.endAngle)/2 < Math.PI*1.1){
          return "beginning";
        } 
        else {
          return "end";
        }
      }).text(function(d){
        var percentage = (d.value/_totalValue)*100;
        return percentage.toFixed(1) + "%";
      });
      
      
      //PartIII init lines
      _lines = _label_group.selectAll("line").data(_filteredPieData);
      _lines.remove();
      _lines.enter().append("svg:line")
        		.attr("x1", 0)
        		.attr("x2", 0)
        		.attr("y1", -_radious-5)
        		.attr("y2", -_radious-20)
        		.attr("transform", function(d) {
        			return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
        		 });

      
    };

	function _textTween(d, i) {
		  var a;
		  if(_oldPieData[i]){
		    a = (_oldPieData[i].startAngle + _oldPieData[i].endAngle - Math.PI)/2;
		  } 
		  else if (!(_oldPieData[i]) && _oldPieData[i-1]) {
		    a = (_oldPieData[i-1].startAngle + _oldPieData[i-1].endAngle - Math.PI)/2;
		  } 
		  else if(!(_oldPieData[i-1]) && _oldPieData.length > 0) {
		    a = (_oldPieData[_oldPieData.length-1].startAngle + _oldPieData[_oldPieData.length-1].endAngle - Math.PI)/2;
		  } 
		  else {
		    a = 0;
		  }
		  var b = (d.startAngle + d.endAngle - Math.PI)/2;

		  var fn = d3.interpolateNumber(a, b);
		  return function(t) {
		    var val = fn(t);
		    return "translate(" + Math.cos(val) * (_radious+_textOffset) + "," + Math.sin(val) * (_radious+_textOffset) + ")";
		  };
	}
    //***********************ABOVE NOT NEEDED ******************************************************/


    return me.endOfClass(arguments);
};
