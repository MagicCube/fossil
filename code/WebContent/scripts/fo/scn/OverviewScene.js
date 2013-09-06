$ns("fo.scn");

$import("fo.view.TaxonSeqView");

$include("fo.res.OverviewScene.css");

fo.scn.OverviewScene = function()
{
    var me = $extend(mx.scn.Scene);
    me.autoFillParent = true;
    me.elementClass = "OverviewScene";
    var base = {};
    
    me.seqView = null;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.initSeqView();
    };
    
    me.initSeqView = function()
    {
        me.seqView = new fo.view.TaxonSeqView({
            frame: {
                left: 0,
                top: 0,
                width: me.frame.width,
                height: me.frame.height - 0
            }
        });
        me.addSubview(me.seqView);
    };
    
    base.activate = me.activate;
    me.activate = function(args, isPoppedBack)
    {
        base.activate(args, isPoppedBack);

        if (!isPoppedBack)
        {
            $("#projectLogo").fadeIn();
        }
        else
        {
            
        }
    };
    
    
    
    me.onKeydown = function(e)
    {
        if (e.keyCode == 13 || e.keyCode == 32)
        {
            me.seqView.startAnimation("To2D");
        }
    };

    return me.endOfClass(arguments);
};
