$ns("fo.scn");

$include("fo.res.DetailScene.css");

fo.scn.DetailScene = function()
{
    var me = $extend(mx.scn.Scene);
    me.elementClass = "DetailScene";
    me.autoFillParent = true;
    var base = {};
    
    me.title = null;
    var _$title = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        me.frame = { width: window.innerWidth * 0.9, height: window.innerHeight * 0.9 };
        base.init(p_options);
        
        _$title = $("<h1 id='title'>");
        me.$container.append(_$title);
    };

    base.activate = me.activate;
    me.activate = function(args, isPoppedBack)
    {
        base.activate(args, isPoppedBack);

        if (!isPoppedBack)
        {
            _$title.text(args.title);
            me.$container.css(args.frame);
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
    };

    return me.endOfClass(arguments);
};
