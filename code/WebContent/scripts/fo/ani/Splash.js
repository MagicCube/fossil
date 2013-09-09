$ns("fo.ani");

fo.ani.Splash = function()
{
    var me = $extend(fo.ani.Animation);
    var base = {};
    
    me.duration = 1000 * 8;
    me.range = 6500;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };

    base.start = me.start;
    me.start = function()
    {
        base.start();
        
        // Opening
        new TWEEN.Tween(me.camera.position)
            .to({ z: 3800 }, me.duration * 0.4)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();       
    
        // Loop
        new TWEEN.Tween(me.rootObject.rotation)
            .to({ y: 2 * Math.PI, x: 2 * Math.PI, z: 2 * Math.PI }, 1000 * 240)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .repeat(1000)
            .start();
        
        me.explode();
    };
    
    me.explode = function()
    {
        // Explosion
        var explosionDuration = me.duration * 0.8;
        for (var i = 0; i < me.objects.length; i++)
        {
            var obj = me.objects[i];
            new TWEEN.Tween(obj.position)
                .delay(Math.random() * explosionDuration / 2 + me.duration * 0.2)
                .to({ x: Math.random() * me.range - me.range / 2,
                      y: Math.random() * me.range - me.range / 2,
                      z: Math.random() * me.range - me.range / 2 }, explosionDuration / 2)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        }
        setTimeout(function(){
            me.trigger("complete");
        }, explosionDuration);
    };

    return me.endOfClass(arguments);
};
