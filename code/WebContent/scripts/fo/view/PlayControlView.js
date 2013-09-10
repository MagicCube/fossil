$ns("fo.view");

$include("fo.res.PlayControlView.css");

fo.view.PlayControlView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "PlayControlView";
    var base = {};
    
    var _$playControl = null;
    var _$progressBar = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        _initPlayControl();
        _initProgressBar();
    };
    
    function _initPlayControl()
    {
        _$playControl = $("<div id=playPause class=paused/>");
        me.$container.append(_$playControl);
    }
    
    function _initProgressBar()
    {
        _$progressBar = $("<div id=progressBar><div id=cursor/></div>");
        me.$container.append(_$progressBar);
    }

    return me.endOfClass(arguments);
};
