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
        if (me.frame.width < 1900)
        {
            $back.css({
                webkitBackgroundSize: (me.frame.height / 1080) * 135 + "% auto"
            });
        }
        me.$container.append(_$intro);
    }

    base.activate = me.activate;
    me.activate = function(args, isPoppedBack)
    {
        base.activate(args, isPoppedBack);
        _$intro.css({
            transform: "scale(0.8)",
            opacity: 0
        });
        setTimeout(function() {
            _$intro.css({
                transform: "",
                opacity: 1
            });
        });
    };

    me.start = function()
    {
        _$intro.transit({
            opacity: 0,
            scale: 0.5
        }, 500, function()
        {
            _$intro.remove();
        });

        setTimeout(function(){
            fo.app.setRootScene("TaxonSequence");
        }, 250);
    };


    var _step = 0;
    me.onKeydown = function(e)
    {
        if (e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 34)
        {
            // if (_step == 0)
            // {
            //     _$intro.addClass("flipped");
            //     _step = 1;
            // }
            // else
            // {
            me.start();
            // }
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
