$ns("fo.scn");

$import("fo.view.GlobeView3D");

$include("fo.res.DiversityScene.css");

fo.scn.DiversityScene = function()
{
    var me = $extend(mx.scn.Scene);
    me.title = "";
    me.autoFillParent = true;
    var base = {};
    
    me.globeView = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        me.initGlobeView();
    };
    
    me.initGlobeView = function()
    {
        me.globeView = new fo.view.GlobeView3D({
            frame: {left: 0,
                    top: 0,
                    width: me.frame.width,
                    height: me.frame.height}
        });
        me.addSubview(me.globeView);
    };

    base.activate = me.activate;
    me.activate = function(args, isPoppedBack)
    {
        base.activate(args, isPoppedBack);

        if (!isPoppedBack)
        {
            $("#projectLogo").fadeIn();
            me.globeView.startAnimate();
        }
        else
        {
            
        }
    };

    return me.endOfClass(arguments);
};
