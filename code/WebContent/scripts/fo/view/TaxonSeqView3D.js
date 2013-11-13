$ns("fo.view");

$import("fo.view.View3D");
$import("fo.ani.Animation");

$include("fo.res.TaxonSeqView.css");
$include("fo.res.TaxonSeqView3D.css");

fo.view.TaxonSeqView3D = function()
{
    var me = $extend(fo.view.View3D);
    me.elementClass = "TaxonSeqView";
    me.renderingMode = "css";
    var base = {};
    
    me.leftMove = 125;
    me.topMove = 270;
    me.spacing = 140;
    me.taxonDivHeight = 19;
    me.labelHeight = 40;
    me.fixedTop = 233;
    
    me.groups = null;
    me.groupType = null;
    
    me.mode = "2D";
    me.scale = 1;
    
    me.padding = {
        top: me.topMove,
        left: 25,
        right: 25
    };
    
    
    me.rootObject = null;
    me.$scene = null;
    me.$camera = null;
    me.styleSheet = null;
    
    me.ongroupclicked = null;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.startAnimation("Splash");
        
        var i = 0;
        for (i = 0; i < document.styleSheets.length; i++)
        {
            if (document.styleSheets[i].href.contains("TaxonSeqView.css"))
            {
                break;
            }
        }
        me.styleSheet = document.styleSheets[i];
        
        me.$element.on("mousedown", ".scene", _scene_onclick);
        me.$element.on("click", ".className", _class_onclick);
    };
    
    base.initScene = me.initScene;
    me.initScene = function()
    {
        me.switchTo3D();
        
        if ($speed == "fast")
        {
            setTimeout(function(){
                me.startAnimation("To2D");
            }, 50);
        }
        
        base.initScene();

    };
    
    base.initCamera = me.initCamera;
    me.initCamera = function()
    {
        base.initCamera();
        
        me.camera.position.z = 0;
    };
    
    

    me.initTaxons = function()
    {
        var innerDiv = d3.select(me.$container.get(0)).selectAll(".taxon")
          .data(fo.taxa)
          .enter()
          .append("div")
          .classed("taxon", true)
          .attr({
              "id": function(d) { return d.id; }
          })
          
          .append("div")
          .style({
              "background-color": function() { return "rgba(123, 29, 32, " + (0.4 + Math.random() * 0.5) + ")"; }
          });
        
        innerDiv.append("span")
                .attr("id", "name")
                .text(function(d) { return d.name; });
        innerDiv.append("span")
                .attr("id", "fullName")
                .text(function(d) { return d.fullName; });
    };
    
    me.initObjects = function()
    {
        me.initTaxons();

        me.rootObject = new THREE.Object3D();
        
        var vector = new THREE.Vector3();
        var l = 400;
        var radius = l * 3.5;
        
        var $t = me.$container.find(".taxon");
        for (var i = 0; i < l; i++)
        {
            var e = $t.get(i);
            var object = new THREE.CSS3DObject(e);

            var phi = Math.acos(-1 + (2 * i) / l);
            var theta = Math.sqrt(l * Math.PI) * phi;

            object.position.x = radius * Math.cos(theta) * Math.sin(phi);
            object.position.y = radius * Math.sin(theta) * Math.sin(phi);
            object.position.z = radius * Math.cos(phi);

            vector.copy(object.position).multiplyScalar(2);

            object.lookAt(vector);

            me.objects.add(object);
            me.rootObject.add(object);
        }
        me.scene.add(me.rootObject);
    };
    
    
    base.startAnimation = me.startAnimation;
    me.startAnimation = function(p_animationName, duration, p_args)
    {
        var ani = null;
        var args = { camera: me.camera, scene: me.scene, rootObject: me.rootObject, objects: me.objects, view: me };
        args = $.extend({}, args, p_args);
        ani = fo.ani.Animation.createInstance(p_animationName, args);
        if (ani != null)
        {
            if ($speed == "fast")
            {
                ani.duration *= 0.05 ;
            }
            else if ($speed == "slow")
            {
                ani.duration *= 1.5;
            }
            ani.start();
        }
        base.startAnimation();
        return ani;
    };
    
    me.groupBy = function(p_group)
    {
 
    	me.groupType = p_group;
    	
    	if (p_group == "class")
    	{
    		me.groups = fo.util.GroupUtil.getClsTaxaGroups();
/*    		me.groups.sort(function(a,b){
    			return a.name.localeCompare(b.name);
    		});*/

    	}
    	
    	else if (p_group == "genus")
    	{
    		me.groups = fo.util.GroupUtil.getGenusTaxaGroups();
    		//console.log(me.groups);
/*    		me.groups.sort(function(a,b){
    			return a.name.localeCompare(b.name);
    		});*/
/*    		var unknownGroup = [];
    		for(var i = 0; i < me.groups.length; i++)
    		{   
    			if( me.groups[i].name.startsWith("Unknown"))
    			{  				
    				unknownGroup.push(me.groups[i]);
    				me.groups.splice(i, 1);
    				//console.log(i + " ," + me.groups[i].name);
    			}
    		}
    		//console.log(me.groups);
    		if(unknownGroup.length >= 1)
    		{
    			for(var i = 0; i < unknownGroup.length; i++)
    			{
    			me.groups.push(unknownGroup[i]);
    			}
    		}*/
    	//	console.log(me.groups);
    	}
    	else
		{
    		me.groups = null;
		}
		
    	me.startAnimation("Grouping", null, {  });

    };
    
    me.switchTo3D = function()
    {
        me.mode = "3D";
        me.$container.removeClass("two-d");
        me.$container.addClass("three-d");
    };
    
    me.switchTo2D = function()
    {
    	
        me.stopAnimation();
        me.isRendering = false;
        me.mode = "2D";
        
        fo.app.searchBoxView.$container.delay(600).fadeIn("slow");
        
        me.$container.append("<div id='topShadow' class='shadow'/><div id='bottomShadow' class='shadow'/>");
        me.$container.find(".shadow").hide().fadeOut(5000);
        
       var scene = me.parentView;
       scene.chronLineView.$element.fadeIn(1000);
       scene.groupSwitchView.$element.fadeIn(1000);
       scene.$mask.fadeIn(1000);
        
        me.$container.find(".camera").css(
        {
            transform : "",
            webkitTransformStyle : "",
            webkitPerspective : ""
        });
        me.$container.find(".scene").css(
        {
            transform : "",
            webkitTransformStyle : "",
            webkitPerspective : ""
        });
        me.$container.find(".taxon").css(
        {
            transform : "",
            webkitTransformStyle : "",
          
            position: "absolute"
        });
        me.$container.find(".taxon div").css(
        {
            height: "",
            border: "",
            borderRadius: ""
        });
        me.$scene = me.$container.find(".scene");
        me.$scene.css({
            "width": "",
            "height": ""
        });
        
        me.$camera = me.$container.find(".camera");
        me.$camera.css({
            "-webkit-transform-origin-x": "",
            "-webkit-transform-origin-y": "",
            "width": "",
            "height": ""
        });

        me.$container.addClass("two-d");
        me.$container.removeClass("three-d");
                
        me.$camera.append(me.$container.children(".taxon"));
        me.$camera.append("<div id=placeHolder/>");
        
        TWEEN.removeAll();
        
        fo.app.searchBoxView.delegate = me;
        me.$scene.css("overflow", "auto").on("mousewheel", _onmousewheel);
      //  me.$scene.on("click", ".taxon", _taxon_onclick);
        me.$scene.on("scroll", _onmousescroll);
        
        me.$element.on("mouseenter", _onmouseenter);
    };
    
    me.search = function(p_keyword, p_control)
    {
        me.setScale(1);
        var keyword = p_keyword.trim().toLowerCase();
               
        me.$scene.scrollTop(0);
              
        var firstfound = false;
        for (var i = 0; i < fo.taxa.length; i++)
        {
            var t = fo.taxa[i];
            var $div = me.$container.find(".taxon#" + t.id);
            if (t.fullName.toLowerCase().startsWith(keyword))
            {
            	if(!firstfound)
            	{
            		var top = $div.css("top").split("px");
            		me.$scene.scrollTop(parseInt(top[0]) - me.topMove);
            		firstfound = true;
            	}
            	
                if(keyword == "")
                {
                	 $div.removeClass("foundStatus");
                	 $div.removeClass("searchStatus");
                }
                else
                {
	            	$div.addClass("foundStatus");
	            	$div.removeClass("searchStatus");
                }
            }
            else
            {
            	$div.removeClass("foundStatus");
                $div.addClass("searchStatus");
            }
        }
    };
    
    me.setScale = function(p_scale)
    {
        if (me.scale == p_scale) return;
        
        me.scale = p_scale;
        
        var height = parseInt(18 * me.scale);
        me.styleSheet.rules[3].style.height = height + "px";
        if (me.scale >= 0.8)
        {
            me.styleSheet.rules[5].style.display = "";
        }
        else
        {
            me.styleSheet.rules[5].style.display = "none";
        }
    };
    
    function _class_onclick(e)
    {
    	var className = this.id;
    	
    	if(className == "Unkown")
    	{
    		
    	}
    	else
    	{
	    	me.trigger("groupclicked", {
	    		className: className
	    	});
    	}
    	
    }
    
    function _taxon_onclick(e)
    {
        var element = this;
        var taxon = fo.taxa[element.id];
        fo.app.popupScene("TaxonDetail", {
            taxon: taxon,
            title: taxon.fullName
        });
    }
    
    function _onmousewheel(e)
    {
        if (e.shiftKey)
        {
            e.preventDefault();
            
            var scale = me.scale + (e.originalEvent.wheelDelta) / 1000;
            
            if (scale > 1)
            {
                scale = 1;
            }
            else if (scale < 0.1)
            {
                scale = 0.1;
            }
            
            me.setScale(scale);
        }
        else
        {
            var event = e.originalEvent;
            if (event.wheelDeltaX > 0 && me.$scene.get(0).scrollLeft == 0)
            {
                e.preventDefault();
            }
            if (event.wheelDeltaX < 0 && me.$scene.get(0).scrollLeft == me.$scene.get(0).scrollWidth - me.$scene.get(0).offsetWidth)
            {
                e.preventDefault();
            }
            
            /*
            if (event.wheelDelta < -30)
            {
                fo.app.searchBoxView.$container.stop(false).fadeOut(30);
            }
            else if (event.wheelDelta > 60)
            {
                fo.app.searchBoxView.$container.stop(false).fadeIn(30);
            }
            */
        }
        e.stopPropagation();
    }
    
    function _onmousescroll(e)
    {
    	var scene = me.parentView;
    	scene.chronLineView.$element.css("left", - me.$scene.get(0).scrollLeft);
    	
    }
    
    function _onmouseenter(e)
    {
    	me.parentView.chronLineView.$element.find(".moveLine").css("left", -3);
    }
    
    function _scene_onclick(e)
    {
    	var groups = me.$element.find("#groupUnderlay")[0];
    	if(groups){
	    	var className = null;
	    	if(e.clientY > me.fixedTop && e.clientY < me.fixedTop + me.labelHeight && e.clientX < 300)
	    	{
	    		className = me.$element.find(".labelFixed").text();
	    	}
	
		
	    	for(var i = 0; i < groups.children.length; i++)
	    	{
	    		var top = groups.children[i].offsetTop;
	
	    		if(me.$scene[0].scrollTop + e.clientY < top + me.labelHeight && me.$scene[0].scrollTop + e.clientY  > top && e.clientX < 300)
	    		{
	    			
	        		className = groups.children[i].innerText;       		       		
	        		break;
	    		}
	    		
	    	}
	    	
	    	if(className != null)
	    	{
	    		var cls = className.split("-");
	    		console.log(cls[0]);
	    		if(cls[0] == "Unkown")
	        	{
	        		
	        	}
	        	else
	        	{
	    	    	me.trigger("groupclicked", {
	    	    		className: cls[0]
	    	    	});
	        	}
	    	}    	
    	}
    }

    return me.endOfClass(arguments);
};
