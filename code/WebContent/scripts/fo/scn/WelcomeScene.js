$ns("fo.scn");

$include("fo.res.WelcomeScene.css");

fo.scn.WelcomeScene = function()
{
    var me = $extend(mx.scn.Scene);
    me.autoFillParent = true;
    me.elementClass = "WelcomeScene";
    var base = {};
    
    var _$intro = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        _initIntro();
    };
    
    function _initIntro()
    {
        _$intro = $("#intro");
        _$intro.css({
            left: (me.frame.width - 800) / 2,
            top: (me.frame.height - _$intro.height()) * (0.35)
        });
        _$intro.on("click", function(){
            me.start();
        });
        me.$container.append(_$intro);
    }

    base.activate = me.activate;
    me.activate = function(args, isPoppedBack)
    {
        base.activate(args, isPoppedBack);

        if (!isPoppedBack)
        {
            _$intro.css({
                display: "block",
                opacity: 0,
                webkitTransform: "scale(0.96)"
            });
            _$intro.transit({
                opacity: 1,
                scale: 1
            }, 2000);
        }
        else
        {
            
        }
    };
    
    me.start = function()
    {
        _$intro.fadeOut(function()
        {
            _$intro.remove();
            
            fo.app.setRootScene("TaxonSequence");
        });
    };
    
    
    me.onKeydown = function(e)
    {
        if (e.keyCode == 13 || e.keyCode == 32)
        {
            me.start();
        }
        else if (e.keyCode == 34)
        {
            me.start();
        }
        else if (e.keyCode == 33)
        {
            
        }
    };

    return me.endOfClass(arguments);
};
