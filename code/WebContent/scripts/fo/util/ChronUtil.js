$ns("fo.util");


fo.util.ChronUtilClass = function()
{
    var me = $extend(MXObject);
    var base = {};
    
    //Define chronostratic master data
    me.systems = [{name: "石炭纪", range: [298.9, 358.9]}, {name: "二叠纪", range: [252.2,298.9]}, {name: "三叠纪", range: [201.3, 252.2]}];
    
    me.series = [{name: "密西西比纪", range: [323.2, 358.9]},
                 {name: "宾夕法尼亚纪", range: [298.9, 323.2]}, 
                 {name: "乌拉尔世", range: [272.3, 298.9]}, 
                 {name: "瓜德鲁普世", range: [259.9, 272.3]}, 
                 {name: "乐平世", range: [252.2, 259.9]},
                 {name: "早三叠世", range: [247.2, 252.2]},
                 {name: "中三叠世", range: [235, 247.2]},
                 {name: "晚三叠世", range: [201.3, 235]}];
    
    me.stages = [{name: "瑞替期", range: [201.3, 208.5]},
                 {name: "诺利期", range: [208.5, 228]},
                 {name: "卡尼期", range: [228, 235]},
                 {name: "拉丁尼期", range: [235, 242]},
                 {name: "安尼西期", range: [242, 247.2]},
                 {name: "奥伦尼克期", range: [247.2, 251.2]},
                 {name: "印度期", range: [251.2, 252.2]},
                 {name: "长兴期", range: [252.2, 254.2]},
                 {name: "吴家坪期", range: [254.2, 259.9]},
                 {name: "卡匹敦阶", range: [259.9,265.1]},
                 {name: "沃德期", range: [265.1, 268.8]},
                 {name: "罗德期", range: [268.8,272.3]},
                 {name: "空谷尔期", range: [272.3, 279.3]},
                 {name: "阿尔丁思克期", range: [279.3,290.1]},
                 {name:"萨克马尔期", range: [290.1, 295.5]},
                 {name: "阿瑟尔期", range: [295.5, 298.9]},
                 {name: "格热尔期", range: [298.9, 303.7]},
                 {name: "卡西莫夫期", range: [303.7, 303.0]},
                 {name: "莫斯科期", range: [307.0, 315.2]},
                 {name: "巴什基尔期", range: [315.2, 323.2]},
                 {name: "谢尔普霍夫期", range: [323.2, 330.9]},
                 {name: "违宪期", range: [330.9, 346.7]},
                 {name: "图尔奈期", range: [346.7, 358.9]}].reverse();
    
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
