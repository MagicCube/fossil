$ns("fo.scn");

$import("fo.view.DiversityGlobeView3D");

$include("fo.res.DiversityScene.css");

fo.scn.TaxonDiversityScene = function()
{
    var me = $extend(mx.scn.Scene);
    me.title = "";
    me.autoFillParent = true;
    var base = {};
    
    me.globeView = null;
    me.playControlView = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        me.initPlayControlView();
        me.initGlobeView();
    };
    
    me.initGlobeView = function()
    {
        me.globeView = new fo.view.DiversityGlobeView3D({
            playControlView: me.playControlView,
            frame: {left: 0,
                    top: 0,
                    width: me.frame.width,
                    height: me.frame.height}
        });
        me.addSubview(me.globeView);
    };
    
    me.initPlayControlView = function()
    {
        me.playControlView = new fo.view.PlayControlView({
            range: [0, fo.taxa.length * 2],
            frame: { bottom: 10, left: 10, right: 10 } 
        });
        me.addSubview(me.playControlView);
    };

    base.activate = me.activate;
    me.activate = function(args, isPoppedBack)
    {
        base.activate(args, isPoppedBack);

        if (!isPoppedBack)
        {
            $("#projectLogo").fadeIn();
            me.globeView.startAnimation();
        }
        else
        {
            
        }
    };
    
    
    
    
    me.onKeydown = function(e)
    {
        if (e.keyCode == 27)
        {
            fo.app.hidePoppedScene();
        }
        else if (e.keyCode == 13 || e.keyCode == 32)
        {
            me.playControlView.togglePlay();
        }
        else if (e.keyCode == 39 || e.keyCode == 40)
        {
            me.playControlView.pause();
            me.playControlView.moveToNextFrame();
            e.stopPropagation();
            e.preventDefault();
        }
        else if (e.keyCode == 37 || e.keyCode == 38)
        {
            me.playControlView.pause();
            me.playControlView.moveToPreviousFrame();
            e.stopPropagation();
            e.preventDefault();
        }
    };

    return me.endOfClass(arguments);
};
