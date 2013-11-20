$ns("fo.util");


fo.util.ChronUtilClass = function()
{
    var me = $extend(MXObject);
    var base = {};
    
    //Define chronostratic master data
    me.systems = [{name: "Carboniferous", range: [298.9, 358.9]}, {name: "Permian", range: [252.2,298.9]}, {name: "Triassic", range: [201.3, 252.2]}];
    
    me.series = [{name: "Mississippian", range: [323.2, 358.9]},
                 {name: "Pennsylvanian", range: [298.9, 323.2]}, 
                 {name: "Cisuralian", range: [272.3, 298.9]}, 
                 {name: "Guadalupian", range: [259.9, 272.3]}, 
                 {name: "Lopingian", range: [252.2, 259.9]},
                 {name: "Lower", range: [247.2, 252.2]},
                 {name: "Middle", range: [235, 247.2]},
                 {name: "Upper", range: [201.3, 235]}];
    
    me.stages = [{name: "Rhaetian", range: [201.3, 208.5]},
                 {name: "Norian", range: [208.5, 228]},
                 {name: "Carnian", range: [228, 235]},
                 {name: "Ladinian", range: [235, 242]},
                 {name: "Anisian", range: [242, 247.2]},
                 {name: "Olenekian", range: [247.2, 251.2]},
                 {name: "Induan", range: [251.2, 252.2]},
                 {name: "Changhsingian", range: [252.2, 254.2]},
                 {name: "Wuchiapingian", range: [254.2, 259.9]},
                 {name: "Capitanian", range: [259.9,265.1]},
                 {name: "Wordian", range: [265.1, 268.8]},
                 {name: "Roadian", range: [268.8,272.3]},
                 {name: "Kungurian", range: [272.3, 279.3]},
                 {name: "Artinskian", range: [279.3,290.1]},
                 {name:"Sakmarian", range: [290.1, 295.5]},
                 {name: "Asselian", range: [295.5, 298.9]},
                 {name: "Gzhelian", range: [298.9, 303.7]},
                 {name: "Kasimovian", range: [303.7, 303.0]},
                 {name: "Moscovian", range: [307.0, 315.2]},
                 {name: "Bashkirian", range: [315.2, 323.2]},
                 {name: "Serpukhovian", range: [323.2, 330.9]},
                 {name: "Visean", range: [330.9, 346.7]},
                 {name: "Tournaisian", range: [346.7, 358.9]}].reverse();
    
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

/*    	if (y > me.systems[0]["range"][1])		
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
		{*/
    		//system = "Permian";
    		//systemIndex = 0;
    		
    		for (var z = 0; z < me.systems.length; z ++)
    		{
    			if (y > me.systems[z].range[0] && y < me.systems[z].range[1])
    			{
    				system = me.systems[z].name;
    				systemIndex = z;
    				break;
    			}
    		}
    		
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
	//	}
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
