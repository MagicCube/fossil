$ns("fo.scn");

$import("fo.view.TaxonChaosView3D");

$include("fo.res.WelcomeScene.css");

fo.scn.WelcomeScene = function()
{
    var me = $extend(mx.scn.Scene);
    me.autoFillParent = true;
    me.elementClass = "WelcomeScene";
    var base = {};
    
    me.taxonChaosView3D = null;
    
    var _$intro = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        _initIntro();
        me.initTaxonView();
    };
    
    me.initTaxonView = function()
    {
        me.taxonView = new fo.view.TaxonChaosView3D({
            frame: {
                left: 0,
                right: 0,
                width: me.frame.width,
                height: me.frame.height
            }
        });
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
            if (!$debug)
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
            
            if ($debug)
            {
                me.start();
            }
        }
        else
        {
            
        }
    };
    
    base.deactivate = me.deactivate;
    me.deactivate = function()
    {
        base.deactivate();
        fo.app.searchBoxView.delegate = null;
    };
    
    me.start = function()
    {
        _$intro.fadeOut(function()
        {
            $("#projectLogo").fadeIn("slow");
            _$intro.remove();
            
            me.addSubview(me.taxonView);
            var ani = me.taxonView.startAnimate("Splash");
            ani.on("complete", function()
            {
                if ($debug)
                {
                    fo.app.searchBoxView.show();
                }
                else
                {
                    fo.app.searchBoxView.$container.fadeIn(1500);
                }
                fo.app.searchBoxView.delegate = me.taxonView;
            });
        });
    };

    return me.endOfClass(arguments);
};
