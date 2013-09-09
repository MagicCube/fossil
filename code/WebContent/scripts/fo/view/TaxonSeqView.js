$ns("fo.view");

$import("fo.view.View3D");
$import("fo.ani.Animation");

$include("fo.res.TaxonSeqView.css");
$include("fo.res.TaxonSeqView3D.css");

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
    
    
    me.rootObject = null;
    me.$scene = null;
    me.$camera = null;
    me.styleSheet = null;

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
          .data(fo.taxons)
          .enter()
          .append("div")
          .classed("taxon", true)
          .attr({
              "id": function(d) { return d.id; },
              "title": function(d) { return d.fullName; }
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
                .text(function(d) { return d.fullName + " #" + (fo.taxons.indexOf(d) + 1); });
    };
    
    me.initObjects = function()
    {
        me.initTaxons();

        me.rootObject = new THREE.Object3D();
        
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

            me.objects.add(object);
            me.rootObject.add(object);
        }
        me.scene.add(me.rootObject);
    };
    
    base.startAnimation = me.startAnimation;
    me.startAnimation = function(p_animationName, duration)
    {
        var ani = null;
        ani = fo.ani.Animation.createInstance(p_animationName, { camera: me.camera, scene: me.scene, rootObject: me.rootObject, objects: me.objects, view: me });
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
        me.isRendering = false;
        me.mode = "2D";
        
        fo.app.searchBoxView.$container.fadeIn("slow");
        
        me.$container.append("<div id='topShadow' class='shadow'/><div id='bottomShadow' class='shadow'/>");
        me.$container.find(".shadow").hide().fadeIn();
        
        
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
        me.$scene.on("click", ".taxon", _taxon_onclick);
    };
    
    me.search = function(p_keyword, p_control)
    {
        me.setScale(1);
        var keyword = p_keyword.trim().toLowerCase();
        me.$scene.scrollTop(0);
        for (var i = 0; i < fo.taxons.length; i++)
        {
            var t = fo.taxons[i];
            var tDiv = document.getElementById(t.id);
            if (t.fullName.toLowerCase().startsWith(keyword))
            {
                $(tDiv).show();
            }
            else
            {
                $(tDiv).hide();
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
    
    
    
    function _taxon_onclick(e)
    {
        var element = this;
        var taxon = fo.taxons[element.id];
        var y = element.offsetTop - me.$scene.scrollTop();
        fo.app.popupScene("Detail", {
            taxon: taxon,
            title: taxon.fullName,
            frame: { top: y, left: parseInt(element.childNodes[0].style.left), width: 100, height: 18 }
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
        }
        e.stopPropagation();
    }

    return me.endOfClass(arguments);
};
