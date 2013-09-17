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
        var $front = _$intro.find("#front");
        $front.css({
            left: (me.frame.width - 800) / 2,
            top: (me.frame.height - $front.height()) * (0.35)
        });
        var $back = _$intro.find("#back");
        $back.css({
            webkitBackgroundSize: (me.frame.width / 1920) * 100 + "% auto"
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
                opacity: 1
            });
        }
        else
        {
            
        }
    };
    
    me.start = function()
    {
        _$intro.transit({
            opacity: 0,
            scale: 0.01
        }, 1000, function()
        {
            _$intro.remove();
            fo.app.setRootScene("TaxonSequence");
        });
    };
    
    
    var _step = 0;
    me.onKeydown = function(e)
    {
        if (e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 34)
        {
            if (_step == 0)
            {
                _$intro.addClass("flipped");
                _step = 1;
            }
            else
            {
                me.start();
            }
        }
        else if (e.keyCode == 33)
        {
            if (_step == 1)
            {
                _$intro.removeClass("flipped");
                _step = 0;
            }
        }
    };

    return me.endOfClass(arguments);
};
