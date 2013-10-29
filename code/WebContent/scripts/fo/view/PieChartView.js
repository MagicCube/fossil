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
    
    var _width = 350;
    var _height = 250;
    var _radius = Math.min(_width, _height) / 3;
    var _r = _radius - 20;
    var _tweenDuration = 250;
    var _textOffset = 30;
    var _totalValue = 0;
    
    var _color = d3.scale.ordinal().range(["#FFFF00","#8FED74","#79C0E0", "#791CBB","#F43D4F","#FF7F1F"]);   //0.45 OPACITY
//    var _color = d3.scale.category10();
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
        
       	_infopadview = d3.select("#piechart");
       	
       	_infopadview.append("span")
       				.attr("id", "title");
       	_infopadview.append("span")
       				.attr("id", "mayear");
       	_infopadview.append("span")
					.attr("id", "taxacount");
       	_infopadview.append("span")
       				.attr("id", "area");
        		
       	//Create pie chart
       	_infopadview.append("span")
       		.attr("id", "proportion");
		_svg = _infopadview.append("svg")
			.attr("width", _width)
			.attr("height", _height);
    };
    
    
    me.loadPieChartData = function(args)
    {
    	//TODO getClassTaxonCountJson (args.yearSelected)	§ Return DataSet:  [{className, count}]
    	if (Math.random()>0.5)
    	{
    		me.data = [{className: "Gastropoda", count: 2}, {className: "Cephalopod", count: 2}, {className: "Brachiopod", count: 2},  {className: "Cephalopod", count: 5}, {className: "Lophophyllum", count: 5}, {className: "Others", count: 5}];
    	}
    	else
    	{
        	me.data = [{className: "Gastropoda", count: 4}, {className: "Cephdddiopod", count: 7}, {className: "Brachdddiopod", count: 9},  {className: "Cephadddiopod", count: 3}, {className: "Lophodddiopod", count: 1}, {className: "Others", count: 5}];
    	}
    	
    	if (_oldPieData.length == 0)
    	{
    		me.initPie();
    	}
    	else
    	{
    		_updatePie();
    	}
        me.initLabel();

    	
    	_infopadview.select("#title").text("Biological Diversity");
    	_infopadview.select("#mayear").text("in" + args.yearSelected + "ma");
    	_infopadview.select("#taxacount").text("Taxa Count: " + _totalValue);
    	_infopadview.select("#area").text("Area: " + me.polygonArea + "km²");
    	_infopadview.select("#proportion").text("Class Proportion");

    };

    me.initPie = function()
    {
 		
		//Set up groups
		var arcs = _svg.selectAll("g.arc")
			  .data(_pie(me.data));
		 arcs.exit().remove();
		 arcs.enter()
			  .append("g")
			  .attr("class", "arc")
			  .attr("transform", "translate(" + (_width/2) + "," + (_height/2) + ")");
		
		//Draw arc paths
		_arc = d3.svg.arc().outerRadius(_r);
        
		arcs.selectAll("path").remove();
		arcs.append("path")
			.attr("d", _arc)
			.attr("fill", function(d, i) {
				return _color(i);
			})
	      .each(function(d) { this._current = d; });		
		 
        _filteredPieData = _pie(me.data).filter(_filterData);
        _oldPieData = _filteredPieData;
		
    };
    
    function _filterData(element, index, array) {
	  	  element.name = me.data[index].className;
	  	  element.value = me.data[index].count;
	  	  _totalValue += element.value;
	  	  return (element.value > 0);
 	}
   
    
    function _updatePie() 
    {
		_totalValue = 0;	//reset to zero
	      _filteredPieData = _pie(me.data).filter(_filterData);
	      _oldPieData = _filteredPieData;
	     // console.log(filteredPieData);
	      
	      var path = _svg.selectAll("g.arc path");
	      path.data(_filteredPieData);
	      path.transition().duration(_tweenDuration).attrTween("d", _arcTween); // redraw the arcs
	      
	      
//	      valueLabels.data(filteredPieData);
//	      valueLabels.text(function(d){
//	          var percentage = (d.value/totalOctets)*100;
//	          return percentage.toFixed(1) + "%";
//	        });
//	      nameLabels.data(filteredPieData);
//	      nameLabels.text(function(d){
//	          return d.name;
//	        });
//	      lines.data(filteredPieData);
//	      
//	      valueLabels.transition().duration(tweenDuration).attrTween("transform", textTween);
//	      nameLabels.transition().duration(tweenDuration).attrTween("transform", textTween);
//	      lines.transition()
//	      .duration(tweenDuration)
//	      .attr("transform", function(d) {
//	        return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
//	      });
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
          return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (_r+_textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (_r+_textOffset) + ")";
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
        return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (_r+_textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (_r+_textOffset) + ")";
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
        		.attr("y1", -_r-5)
        		.attr("y2", -_r-20)
        		.attr("transform", function(d) {
        			return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
        		 });

      
    };
    
    


    function _arcTween(a) {
    	  var i = d3.interpolate(this._current, a);
    	  this._current = i(0);
    	  return function(t) {
    	    return _arc(i(t));
    	  };
    	}

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
		    return "translate(" + Math.cos(val) * (_r+_textOffset) + "," + Math.sin(val) * (_r+_textOffset) + ")";
		  };
	}


    return me.endOfClass(arguments);
};
