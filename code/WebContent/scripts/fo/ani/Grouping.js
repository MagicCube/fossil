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
        
        var classesHeight = [];
        var labelHeight = [];
        var duration = me.duration;
        var scrollWidth = me.view.$element.find(".scene").scrollWidth;
        
/*        var canvas = me.view.$element.find("#lineCanvas")[0];
        var ctx = canvas.getContext('2d');    */   
       
        me.groups = fo.app.scenes.TaxonSequence.seqView.groups;
        var groupType = fo.app.scenes.TaxonSequence.seqView.groupType;
        
        if (me.groups != null)
    	{
        	me.view.$element.find(".scene").scrollTop(0);
	    	var height= me.spacing;
	    	
	    	me.view.$element.find(".groupLabel").remove();
	    	
	    	
/*	    	ctx.clearRect(0, 0, canvas.width, canvas.height);
	    	ctx.beginPath();*/
	    	
	    	
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
	    		me.view.$element.find(".camera").append($groupLabel);
	    		$groupLabel.css("top", fixHeight);
	    		$groupLabel.fadeIn(3000);

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
	                
	 //               var tLeft = parseInt(div.children[0].style.left);
	/*                if(taxaAmount > 19)
	                {
	                	ctx.moveTo( 40 + 38 - j*38/taxaAmount, fixHeight + 38);
	                }*/
	                

	                
/*	                ctx.moveTo(110, fixHeight + 19);
	                ctx.bezierCurveTo(0, fixHeight + 38 + (topHeight - fixHeight)/2,  110, topHeight + 9, tLeft, topHeight + 9);*/

		    /*        ctx.moveTo( 40 + 19, fixHeight + 38);		
	                ctx.lineTo(130, me.topMove + height + 9);	               
	                ctx.lineTo(tLeft, me.topMove + height + 9);*/
	          
	    		}
	    	   
	    		height = me.spacing + height;
	    		classesHeight.push(height);
	    	}

	    	var $scene = me.view.$element.find(".scene");
	    	$scene.scroll(function() {
	    		
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
	    		
/*	    		var sLeft = $scene[0].scrollLeft;
	    		if(sLeft >= 0) 
	    		{
	    			
	    			$(".groupLabel").css("left", sLeft);	    			
	    			$("#" + divName).css("left", 0);
	    		}	*/
	    		
	    	});
	    	
/*	        ctx.closePath();
      	    ctx.strokeStyle = "#898989";
            ctx.stroke();*/

    	}
        else
    	{
        	me.view.$element.find(".groupLabel").remove();
        	me.view.$element.find(".scene").scrollTop(0);
            for (var i = 0; i < fo.taxa.length; i++)
            {
                var t = fo.taxa[i];
                var target = {                		
                        top: i * 19 +  me.topMove,                      
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
