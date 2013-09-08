$ns("fo.ani");

fo.ani.To2D = function()
{
    var me = $extend(fo.ani.Animation);
    var base = {};
    
    me.duration = 1000 * 4;
    
    
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
        
        var duration = me.duration;
        
        var $extra = me.view.$container.children(".taxon");
        for (var i = 0; i < $taxons.length; i++)
        {
            var target = { 
                    left: i* 2 + me.view.padding.left,
                    width: 300 * Math.random(),
                    height: 18,
                    top: (-i) * 18 - me.view.padding.top,
                    borderOpacity: 0
            };
            if (i < me.objects.length)
            {
                var obj = me.objects[i];
                
                new TWEEN.Tween(obj.rotation)
                    .delay(Math.random() * duration / 2)
                    .to({ x: 0,
                          y: 0,
                          z: 0 }, duration / 2)
                    .easing(TWEEN.Easing.Exponential.Out)
                    .start();
                
                new TWEEN.Tween(obj.position)
                    .delay(Math.random() * duration / 3)
                    .to({ x: 0,
                          y: 0,
                          z: 0 }, duration / 3 * 2)
                    .easing(TWEEN.Easing.Exponential.Out)
                    .start();
                
                new TWEEN.Tween({ taxonDiv: obj.element, taxonInnerDiv: obj.element.childNodes[0], width: 280, height: 280, top: 0, borderOpacity: 0.2 })
                    .delay(Math.random() * duration / 3)
                    .to(target, duration / 3 * 2)
                    .easing(TWEEN.Easing.Exponential.Out)
                    .onUpdate(function(){
                        this.taxonInnerDiv.style.borderRadius = 0;
                        this.taxonDiv.style.top = this.top + "px";
                        this.taxonInnerDiv.style.borderColor = "rgba(255, 255, 255, " + this.borderOpacity + ")";
                        this.taxonInnerDiv.style.width = this.width + "px";
                        this.taxonInnerDiv.style.height = this.height + "px";
                        this.taxonInnerDiv.style.left = this.left + "px";
                    }).
                    onComplete(function(){
                        this.taxonInnerDiv.style.border = "none";
                        //this.taxonInnerDiv.style.borderRadius = 0;
                    })
                    .start();
            }
            else
            {
                var taxonDiv = $extra[i - me.objects.length];
                var taxonInnerDiv = taxonDiv.childNodes[0];
                taxonInnerDiv.style.width = target.width + "px";
                taxonInnerDiv.style.height = target.height + "px";
                taxonInnerDiv.style.left = target.left + "px";
            }
        }
        
        new TWEEN.Tween(me.camera.rotation)
            .delay(Math.random() * duration / 2)
            .to({ x: 0,
                  y: 0,
                  z: 0 }, duration / 2)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        
        var aspect = me.view.frame.width / me.view.frame.height;
        var ratio = aspect / (16 / 9);
        var z = 704 / ratio * (me.view.frame.width / 1920);
    
        new TWEEN.Tween(me.camera.position) 
            .to({ x: me.view.frame.width / 2,
                  y: -me.view.frame.height / 2,
                  z: z }, duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onComplete(function(){
                me.view.stopAnimation();
                setTimeout(_afterFirstMove, 200);
            })
            .start();
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
