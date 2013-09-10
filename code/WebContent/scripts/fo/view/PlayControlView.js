$ns("fo.view");

$include("fo.res.PlayControlView.css");

fo.view.PlayControlView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "PlayControlView";
    var base = {};
    
    me.playState = null;
    me.position = 0;
    me.positionPercentage = 0;
    me.range = [0, 100];
    
    me.onplaystatechanged = null;
    me.onpositionchanged = null;
    
    var _$playPause = null;
    var _$progressBar = null;
    var _$cursor = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        _initPlayPause();
        _initProgressBar();
        
        me.setRange(me.range);
        me.pause();
    };

    function _initPlayPause()
    {
        _$playPause = $("<div id=playPause/>");
        _$playPause.on("click", _playPause_onclick);
        me.$container.append(_$playPause);
    }
    
    function _initProgressBar()
    {
        _$progressBar = $("<div id=progressBar><div id=cursor/></div>");
        _$cursor = _$progressBar.children("#cursor");
        me.$container.append(_$progressBar);
    }
    
    
    
    
    me.play = function()
    {
        var result = me.setPlayState("playing");
        if (result)
        {
            if (me.position >= me.range[1])
            {
                me.setPosition(me.range[0]);
            }
            _loop();
        }
        return result;
    };
    
    me.pause = function()
    {
        return me.setPlayState("paused");
    };
    
    me.togglePlay = function()
    {
        if (me.playState == "playing")
        {
            me.pause();
        }
        else if (me.playState == "paused")
        {
            me.play();
        }
    };
    
    me.setPlayState = function(p_state)
    {
        if (me.playState == p_state)
        {
            return false;
        }
        me.playState = p_state;
        if (me.playState == "playing")
        {
            me.$container.addClass("playing").removeClass("paused");
        }
        else if (me.playState == "paused")
        {
            me.$container.addClass("paused").removeClass("playing");
        }
        me.trigger("playstatechanged");
        return true;
    };
    
    me.setRange = function(p_range)
    {
        me.range = p_range;
        me.setPosition(me.range[0]);
    };
    
    me.setPosition = function(p_pos)
    {
        if (p_pos > me.range[1])
        {
            p_pos = me.range[1];
        }
        else if (p_pos < me.range[0])
        {
            p_pos = me.range[0];
        }
        me.position = p_pos;
        me.positionPercentage = (me.position - me.range[0]) / (me.range[1] - me.range[0]);
        me.update();
        
        me.trigger("positionchanged");
        return me.position;
    };
    
    me.update = function()
    {
        _$cursor.css({
            width: (_$progressBar.width() - 15)  * me.positionPercentage + 15
        });
    };
    
    me.onFraming = function()
    {
        if (me.position >= me.range[1])
        {
            me.pause();
            return;
        }
        me.setPosition(me.position + 1);
    };
    
    
    
    function _loop()
    {
        if (me.playState == "playing")
        {
            requestAnimationFrame(_loop);
        }
        else
        {
            return;
        }
        
        me.onFraming();
    }
    
    function _playPause_onclick(e)
    {
        me.togglePlay();
    }

    return me.endOfClass(arguments);
};
