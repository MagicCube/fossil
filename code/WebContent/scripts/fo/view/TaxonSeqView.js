$ns("fo.view");

$import("fo.view.View3D");
$import("fo.ani.Animation");

$include("fo.res.TaxonSeqView.css");

fo.view.TaxonSeqView = function()
{
    var me = $extend(fo.view.View3D);
    me.elementClass = "TaxonSeqView";
    me.renderingMode = "css";
    var base = {};
    
    me.mode = "2D";
    me.scale = 1;
    
    me.padding = {
        top: 75,
        left: 25,
        right: 25
    };
    
    me.$scene = null;
    me.$camera = null;
    
    var _scrollableContainer = null;
    var _scalableContainer = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.startAnimation("Splash");
    };
    
    base.initScene = me.initScene;
    me.initScene = function()
    {
        me.switchTo3D();
        
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
        d3.select(me.$container.get(0)).selectAll(".taxon")
          .data($taxons)
          .enter()
          .append("div")
          .classed("taxon", true)
          .attr({
              "id": function(d) { return d.name; },
              "title": function(d) { return d.fullName; }
          })
          
          .append("div")
          .style({
              "background-color": function() { return "rgba(123, 29, 32, " + (0.65 + Math.random() * 0.25) + ")"; }
          })
          
          .append("span")
          .text(function(d) { return d.name; });
    };
    
    me.initObjects = function()
    {
        me.initTaxons();

        var vector = new THREE.Vector3();
        var l = 500;
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

            me.scene.add(object);
            me.objects.add(object);
        }
    };
    
    base.startAnimation = me.startAnimation;
    me.startAnimation = function(p_animationName, duration)
    {
        var ani = null;
        ani = fo.ani.Animation.createInstance(p_animationName, { camera: me.camera, objects: me.objects, view: me });
        if (ani != null)
        {
            if ($speed == "fast")
            {
                ani.duration *= 0.05;
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
    
    me.switchTo3D = function()
    {
        me.mode = "3D";
        me.$container.removeClass("two-d");
        me.$container.addClass("three-d");
    };
    
    me.switchTo2D = function()
    {       
        me.stopAnimation();
        me.mode = "2D";
        
        fo.app.searchBoxView.$container.fadeIn("slow");
        
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
            top: "",
            position: ""
        });
        
        me.$scene = me.$container.find(".scene");
        me.$camera = me.$container.find(".camera");
        
        
        me.$camera.css("-webkit-transform-origin-x", "0");
        me.$camera.css("-webkit-transform-origin-y", "0");
        me.$scene.on("mousewheel", _onmousewheel);

        me.$container.addClass("two-d");
        me.$container.removeClass("three-d");
        
        me.$camera.append(me.$container.children(".taxon"));
        
        TWEEN.removeAll();
    };
    
    
    
    
    function _onmousewheel(e)
    {
        if (e.shiftKey)
        {
            e.preventDefault();
            
            if (e.originalEvent.wheelDelta < 0)
            {
                me.scale += (e.originalEvent.wheelDelta) / 1000;
            }
            else
            {
                me.scale += (e.originalEvent.wheelDelta) / 1000;
            }
            
            if (me.scale > 2)
            {
                me.scale = 2;
            }
            else if (me.scale < 0.1)
            {
                me.scale = 0.1;
            }
            
            if (me.scale < 1)
            {
                me.$camera.css("transform", "scale(" + me.scale + ")");
            }
            else
            {
                me.$camera.css("transform", "scale(" + me.scale + ")");
            }
        }
        else
        {
            e.preventDefault();
            
            var scrollTop = me.$scene.scrollTop();
            
            var delta = parseInt((e.originalEvent.wheelDelta) * 0.8);
            scrollTop = scrollTop - delta;
            
            if (scrollTop < 0)
            {
                scrollTop = 0;
            }
            else if (me.scale < 1 && ((me.$scene.get(0).scrollHeight * me.scale - scrollTop) <= me.$scene.height()))
            {
                me.$scene.get(0);
                return;
            }
            me.$scene.scrollTop(scrollTop);
        }
        e.stopPropagation();
    }

    return me.endOfClass(arguments);
};
