$ns("fo.ani");

fo.ani.Explosion = function()
{
    var me = $extend(fo.ani.Animation);
    var base = {};
    
    me.duration = 5000;
    me.range = 6000;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };

    base.start = me.start;
    me.start = function()
    {
        base.start();
        
        new TWEEN.Tween(me.camera.position)
            .to({ x: -4500, z: 1800, y: 2000 }, 1000 * 120)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
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
                .delay(Math.random() * explosionDuration / 2)
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
