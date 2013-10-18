$ns("fo.util");


fo.util.ChronUtilClass = function()
{
    var me = $extend(MXObject);
    var base = {};
    
    //Define chronostratic master data
    me.systems = [{name: "Permian", range: [252.2,298.9]}];
    me.series = [{name: "Cisuralian", range: [272.3, 298.9]}, {name: "Guadalupian", range: [259.9, 272.3]}, {name: "Lopingian", range: [252.2, 259.9]}];
    me.stages = [{name: "Changhsingian", range: [252.2, 254.2]},
                 {name: "Wuchiapingian", range: [254.2, 259.9]},
                 {name: "Capitanian", range: [259.9,265.1]},
                 {name: "Wordian", range: [265.1, 268.8]},
                 {name: "Roadian", range: [268.8,272.3]},
                 {name: "Kungurian", range: [272.3, 279.3]},
                 {name: "Artinskian", range: [279.3,290.1]},
                 {name:"Sakmarian", range: [290.1, 295.5]},
                 {name: "Asselian", range: [295.5, 298.9]}].reverse();
    
    base._ = me._;
    me._ = function(p_options)
    {
        if (me.canConstruct())
        {
            base._(p_options);
        }
    };

   //return chronostratic description based on ma Year
    me.getChron = function(y)
    {
    	var chron = {};
    	var system, series, stage;
    	var systemIndex = -1;
    	var seriesIndex = -1;
    	var stageIndex = -1;

    	if (y > me.systems[0]["range"][1])		
    	{
			system = "Carboniferous";
			series = "Upper";
			stage = "Gzhelian";
			
    	}
    	else if (y < me.systems[0]["range"][0])
		{
   			system= "Triassic";
   			series= "Lower";
   			stage= "Induan"; 
   			
		}
    	else
		{
    		system = "Permian";
    		systemIndex = 0;
    		for (var i=0; i < me.series.length; i++)
			{
			if (y>me.series[i].range[0] && y<me.series[i].range[1])
				{
				series = me.series[i].name;
				seriesIndex = i;
				break;
				}
			}
    		for (var j=0; j < me.stages.length; j++)
			{
			if (y>me.stages[j].range[0] && y<me.stages[j].range[1])
				{
				stage = me.stages[j].name;
				stageIndex = j;
				break;
				}
			}
		}
    	chron = {
    			system: system,
    			systemIndex: systemIndex,
    			series: series,
    			seriesIndex: seriesIndex,
    			stage: stage,
    			stageIndex: stageIndex};
     	return chron;
    };


    return me.endOfClass(arguments);
};

fo.util.ChronUtil = new fo.util.ChronUtilClass();
