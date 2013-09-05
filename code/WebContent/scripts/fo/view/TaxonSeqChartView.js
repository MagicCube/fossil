$ns("fo.view");

$include("fo.res.TaxonSeqChartView.css");

fo.view.TaxonSeqChartView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "TaxonSeqChartView";
    var base = {};
    
    me.data = null;
    
    me.svg = null;
    me.svgRootGroup = null;
    
    me.scrollTop = 0;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);

        me.svg = d3.select(me.$container.get(0)).append("svg").attr("width", me.frame.width).attr("height", me.frame.height);
        me.svgRootGroup = me.svg.append("g");
        me.$container.append(me.svg[0]);
        
        me.svg.on("mousewheel", function()
        {
            me.scrollTop += -d3.event.wheelDelta / 10;
            
            var max = me.svgRootGroup.node().getBoundingClientRect().height - me.frame.height;
            if (me.scrollTop < 0)
            {
                me.scrollTop = 0;
            }
            else if (me.scrollTop > max)
            {
                me.scrollTop = max;
            }
            me.svgRootGroup.attr("transform", "translate(0, " + -me.scrollTop + ")");
        });

        
        
        var data = [];
        $data = data;
        var l = 1200;
        for (var i = 0; i < l; i++)
        {
            var start = parseInt(Math.random() * (l - 10) * 2);
            var end = start + parseInt(Math.random() * (l * 2 - start) / 4);
            var item = {
                name: $taxons[i].name,
                start: start,
                end: end
            };
            data.add(item);
        }
        me.setData(data);
    };

    
    me.setData = function(p_data)
    {
        me.data = p_data;
        me.data.sort(function(item1, item2){
            return d3.ascending(item1.start, item2.start);
        });
        
        var xScale = d3.scale.linear();
        xScale
            .domain([0, me.data.length * 2])
            .range([50, me.frame.width - 100]);
        
        var lineWidth = 5;
        var lineSpace = 3;
        
        me.svgRootGroup.selectAll("rect.taxon")
            .data(me.data)
            .enter()
            .append("rect")
            .classed("taxon", true)
            .attr("height", lineWidth)
            .attr("x", function(d) { return xScale(d.start); })
            .attr("width", function(d) { return xScale(d.end - d.start); })
            .attr("y", function(d, i) { return i * (lineWidth + lineSpace); });
    };

    return me.endOfClass(arguments);
};
