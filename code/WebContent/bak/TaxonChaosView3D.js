$ns("fo.view");

$import("fo.view.View3D");
$import("fo.ani.Animation");

$include("fo.res.TaxonChaosView3D.css");

fo.view.TaxonChaosView3D = function()
{
    var me = $extend(fo.view.View3D);
    me.elementClass = "TaxonChaosView3D";
    me.renderingMode = "css";
    me.isAnimating = true;
    var base = {};
    
    
    me.objects = [];
    
    me.root = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.on("rendering", _onrendering);
    };

    me.initObjects = function()
    {
        me.root = new THREE.Object3D();
        
        var vector = new THREE.Vector3();
        var l = 600;
        var radius = l * 3.5;
        for ( var i = 0; i < l; i++)
        {
            var t = $taxons[i];
            var $div = $("<div class='taxon'>");
            $div.css("backgroundColor", "rgba(123, 29, 32, " + (0.4 + Math.random() * 0.5) + ")");
            $div.text(t.name.replace(".1111", ""));
            var object = new THREE.CSS3DObject($div.get(0));
            object.taxon = t;

            var phi = Math.acos(-1 + (2 * i) / l);
            var theta = Math.sqrt(l * Math.PI) * phi;

            object.position.x = radius * Math.cos(theta) * Math.sin(phi);
            object.position.y = radius * Math.sin(theta) * Math.sin(phi);
            object.position.z = radius * Math.cos(phi);

            vector.copy(object.position).multiplyScalar(2);

            object.lookAt(vector);

            me.root.add(object);
            me.objects.add(object);
        }
        me.scene.add(me.root);
    };
    
    base.initCamera = me.initCamera;
    me.initCamera = function()
    {
        base.initCamera();
        
        me.camera.position.z = 0;
    };

    
    base.startAnimation = me.startAnimation;
    me.startAnimation = function(p_animationName)
    {
        if (me.trackballControl == null)
        {
            setTimeout(function()
            {
                me.initTrackballControl();
            }, 1000);
        }
        
        var ani = null;
        
        if (p_animationName == "Splash")
        {
            ani = fo.ani.Animation.createInstance(p_animationName, { camera: me.camera, objects: me.objects, duration: ($debug ? 100 : 1000 * 10) });
            ani.start();
        }
        else if (p_animationName == "Explosion")
        {
            ani = fo.ani.Animation.createInstance(p_animationName, { camera: me.camera, objects: me.objects, duration: 5 * 1000 });
            ani.start();
        }
        
        base.startAnimation();
        return ani;
    };
    
    
    
    me.search = function(p_keyword)
    {
        if (p_keyword == "")
        {
            me.startAnimation("Explosion");
            return;
        }
        
        TWEEN.removeAll();
        var duration = 3000;
        var targets = [];
        for (var i = 0; i < me.objects.length; i++)
        {
            var obj = me.objects[i];
            if (obj.taxon.name.toLowerCase().startsWith(p_keyword))
            {
                targets.add(obj);
            }
            else
            {
                new TWEEN.Tween(obj.position)
                    .delay(Math.random() * duration / 2)
                    .to({ z: 10000 }, duration / 2)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            }
        }
        
        targets.sort(function(a, b)
        {
            return a.taxon.name.localeCompare(b.taxon.name);
        });
        
        var columnSize = 15;
        var rowSize = Math.ceil(targets.length / columnSize);
        for (var i = 0; i < targets.length; i++)
        {
            var obj = targets[i];
            var col = (i % columnSize) - columnSize / 2;
            var row = Math.floor(i / columnSize) - rowSize / 2;
            new TWEEN.Tween(obj.position)
                .delay(Math.random() * duration / 2)
                .to({ x: col * 300, y: -row * 300, z: 0 }, duration / 2)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
            new TWEEN.Tween(obj.rotation)
                .delay(Math.random() * duration / 2)
                .to({ x: 0, y: 0, z: 0 }, duration / 2)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        }
        
        new TWEEN.Tween(me.camera.position)
            .to({ x: 0, y: 0, z: 2500 }, duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        new TWEEN.Tween(me.camera.rotation)
            .to({ x: 0, y: 0, z: 0 }, duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    };
    
    
    function _onrendering()
    {   
        //var time = Date.now() * 0.00001;
        //me.root.rotation.z = -time;
        //me.root.rotation.y = time;
    }

    return me.endOfClass(arguments);
};
