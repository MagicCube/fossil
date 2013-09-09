$ns("fo.ani");

$import("fo.ani.Splash");
$import("fo.ani.To2D");

fo.ani.Animation = function()
{
    var me = $extend(MXComponent);
    var base = {};
    
    me.nextAnimation = null;
    me.view = null;
    me.camera = null;
    me.objects = null;
    
    me.duration = 0;
    
    me.onstart = null;
    me.oncomplete = null;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.on("complete", me._oncomplete);
    };

    me.start = function()
    {
        TWEEN.removeAll();
        me.trigger("start");
    };
    
    me.chain = function(p_nextAnimation)
    {
        me.nextAnimation = p_nextAnimation;
        return me.nextAnimation;
    };
    
    me._oncomplete = function()
    {
        if (me.nextAnimation != null)
        {
            me.nextAnimation.start();
        }
        me.nextAnimation = null;
        me.view = null;
        me.camera = null;
        me.objects = null;
    };

    return me.endOfClass(arguments);
};

fo.ani.Animation.createInstance = function(p_name, args)
{
    var cls = fo.ani[p_name];
    var inst = new cls(args);
    return inst;
};