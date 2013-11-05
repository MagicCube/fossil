$ns("fo.ani");

$include("fo.res.Grouping.css");

fo.ani.Grouping = function()
{
    var me = $extend(fo.ani.Animation);
    var base = {};
    
    me.duration = 1000 * 3;
    me.topMove = 200;
    me.spacing = 88;
    me.labelMove = 55;
    
    me.classHeight = null;
    me.labelHeight = null;   
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };

    base.start = me.start;
    me.start = function()
    {
        base.start();
        
        TWEEN.removeAll();
        
        me.view.$element.find(".searchStatus").removeClass("searchStatus");
        //console.log(me.view.$element.find(".searchStatus"));
        me.view.$element.find("#groupUnderlay").remove();
        
        var $groupUnderlay =  $("<div id=groupUnderlay ></div>");
        me.view.$element.append($groupUnderlay);
        
        classesHeight = [];
        labelHeight = [];
        var duration = me.duration;
        var scrollWidth = me.view.$element.find(".scene").scrollWidth;
       
        me.groups = fo.app.scenes.TaxonSequence.seqView.groups;
        var groupType = fo.app.scenes.TaxonSequence.seqView.groupType;
        
        if (me.groups != null)
    	{
        	fo.app.searchBoxView.$container.hide();
        	me.view.$element.find(".scene").scrollTop(0);
	    	var height= me.spacing;
	    	
	    	me.view.$element.find(".groupLabel").remove();
	    	
	    	for(var i = 0; i < me.groups.length; i++)
	    	{
	    		var group = me.groups[i];
	   			var $groupLabel = $("<div id='groupLabel" + i +"' class=groupLabel></div>");
	   			var $expandDiv = null;   
	   			var $className = null;
	   			$groupLabel.css("width", scrollWidth);
	   			
	    		if(groupType == "genus")	    		
	    		{
	    			$expandDiv = $("<div class=classExpand/>");
	    			$groupLabel.append($expandDiv);
	    			var nameArray = group.name.split("-");
	    			$className = $("<span id="+ group.name +" class=className>" + nameArray[0] + "</span>");
	    			var $genusName = $("<span id=genusName>" + "-" + nameArray[1] + "</span>");
	    			$groupLabel.append($className, $genusName);

	    		}
	    		else
	    		{	
	    			$expandDiv = $("<div class=genusExpand/>");
	    			$groupLabel.append($expandDiv);

	    			$className = $("<span id="+ group.name +" class=className>" + group.name + "</span>");
		    		$groupLabel.append($className);		    		
	    		}
	    		
	    		var fixHeight = me.topMove + height - me.labelMove;
	    		labelHeight.push(fixHeight);

	    		$groupLabel.css("top", fixHeight);
	    		$groupLabel.fadeIn(3000);
	    			    		
	    		$groupUnderlay.append($groupLabel);

	    		var taxaAmount = group.taxa.length;
	    		for(var j = 0; j < taxaAmount; j++)
	    		{
	    			height += 19;
	    			
	    			var topHeight = me.topMove + height;
	                var t = group.taxa[j];            
	                var target = { 
	                        top: topHeight
	                };
	
	                var div = document.getElementById(t.id);
	                new TWEEN.Tween({ div: div })
	                    .delay(Math.random() * duration / 3)
	                    .to(target, duration / 3 * 2)
	                    .easing(TWEEN.Easing.Exponential.Out)  
	                    .onUpdate(function(){                   
	                       this.div.style.top = this.top + "px";
	                    })
	                    .start();	  
	                          
	    		}
	    	   
	    		height = me.spacing + height;
	    		classesHeight.push(height);
	    			    		
	    	}	    	

	    	var $scene = me.view.$element.find(".scene");
	    	$scene.scroll(function() {
	    		me.view.$element.find("#groupUnderlay").scrollTop($scene[0].scrollTop);	   
	    		
	    		var divName = null;	
	    		for(var i = 0; i < classesHeight.length; i++)
	    		{
	    		  if($scene[0].scrollTop < classesHeight[i] - me.spacing)
	    		  {
	    			  divName = "groupLabel" + i;
	    			  me.view.$element.find(".groupLabel").removeClass("labelFixed");
	    			  me.view.$element.find("#" + divName).addClass("labelFixed");
	    			  
	    		  	  break;
	    		  }
	    		  
	    		}
	    		
	    	});
	    	
    	}
        else
    	{
        	fo.app.searchBoxView.$container.show();
        	me.view.$element.find(".groupLabel").remove();
        	me.view.$element.find(".scene").scrollTop(0);
            for (var i = 0; i < fo.taxa.length; i++)
            {
                var t = fo.taxa[i];
                var target = {                		
                        top: i * 19 +  me.topMove + 50,                      
                };
                
                var div = document.getElementById(t.id);
                new TWEEN.Tween({ div: div })
                    .delay(Math.random() * duration / 3)
                    .to(target, duration / 3 * 2)
                    .easing(TWEEN.Easing.Exponential.Out)  
                    .onUpdate(function(){                   
                       this.div.style.top = this.top + "px";
                    })
                    .start();                
            }

    	}
    };
    
    
    function _afterFirstMove()
    {
        me.view.switchTo2D();
        
        
        for (var i = 0; i < me.objects.length; i++)
        {
            var obj = me.objects[i];
            obj.element.style.top = obj.element.style.top.replace("-", ""); 
        }
    }
    

    return me.endOfClass(arguments);
};
