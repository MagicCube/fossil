$ns("fo.scn");

$import("fo.view.TaxonSeqView3D");

fo.scn.TaxonSequenceScene = function()
{
    var me = $extend(mx.scn.Scene);
    me.autoFillParent = true;
    me.elementClass = "TaxonSequenceScene";
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
        me.seqView = new fo.view.TaxonSeqView3D({
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
    
    
    
    var _to2D = false;
    me.onKeydown = function(e)
    {
        if (!_to2D && (e.keyCode == 13 || e.keyCode == 32))
        {
            _to2D = true;
            me.seqView.startAnimation("To2D");
        }
    };

    return me.endOfClass(arguments);
};