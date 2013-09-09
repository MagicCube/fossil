$ns("fo.view");

fo.view.View3D = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "View3D";
    var base = {};

    
    me.isRendering = true;
    me.isAnimating = false;
    me.antialias = false;
    
    
    me.scene = null;
    me.camera = null;
    me.renderer = null;
    me.renderingMode = "webgl";
    me.rendererClass = THREE.WebGLRenderer;
    me.trackballControl = null;
    
    
    me.objects = [];

    
    me.onrendering = null;
    

    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.initScene();
        me.initCamera();
        me.initRenderer();
    };
    
    me.initScene = function()
    {
        me.scene = new THREE.Scene();
        me.initObjects();
    };
    
    me.initObjects = function()
    {
        
    };
    
    me.initRenderer = function()
    {
        if (me.renderingMode == "css")
        {
            me.rendererClass = THREE.CSS3DRenderer;
        }
        else if (me.renderingMode == "canvas")
        {
            me.rendererClass = THREE.CanvasRenderer;
        }
        else
        {
            me.rendererClass = THREE.WebGLRenderer;
        }
        me.renderer = new me.rendererClass({ antialias: me.antialias });
        me.renderer.setSize(me.frame.width, me.frame.height);
        me.$element.get(0).appendChild(me.renderer.domElement);
    };
    
    me.initCamera = function()
    {
        me.camera = new THREE.PerspectiveCamera(75, me.frame.width / me.frame.height, 150, 1000);
    };
    
    me.initTrackballControl = function()
    {
        if (me.trackballControl == null)
        {
            me.trackballControl = new THREE.TrackballControls(me.camera, me.renderer.domElement);
            me.trackballControl.rotateSpeed = 0.5;
            //me.trackballControl.noRotateY = true;
            me.on("rendering", function()
            {
                me.trackballControl.update();
            });
        }
    };
    
    
    
    
    
    
    me.render = function ()
    {
        if (me.isAnimating)
        {
            requestAnimationFrame(me.render);
        }

        if (me.isRendering)
        {
            me.trigger("rendering");
        }
        
        TWEEN.update();
        
        if (me.isRendering)
        {
            me.renderer.render(me.scene, me.camera);
        }
    };
    
    me.startAnimation = function()
    {
        me.isAnimating = true;
        me.render();
    };
    
    me.stopAnimation = function()
    {
        me.isAnimating = false;
    };

    return me.endOfClass(arguments);
};
