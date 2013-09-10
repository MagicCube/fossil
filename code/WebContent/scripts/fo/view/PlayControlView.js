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
    
    var _$label = null;
    var _$playPause = null;
    var _$progressBar = null;
    var _$cursor = null;
    var _$start = null;
    var _$center = null;
    var _$end = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        _initLabel();
        _initPlayPause();
        _initProgressBar();
        _initRange();
        
        me.setRange(me.range);
        me.pause();
    };
    
    function _initLabel()
    {
        _$label = $("<div id='label'/>");
        me.$container.append(_$label);
    }

    function _initPlayPause()
    {
        _$playPause = $("<div id=playPause/>");
        _$playPause.on("click", _playPause_onclick);
        me.$container.append(_$playPause);
    }
    
    function _initProgressBar()
    {
        _$progressBar = $("<div id=progressBar><div id=cursor></div></div>");
        _$progressBar.on("mousedown", _progressBar_onmousedown);
        _$cursor = _$progressBar.children("#cursor");
        me.$container.append(_$progressBar);
    }
    
    function _initRange()
    {
        _$start = $("<div id='start' class='range'/>");
        _$end = $("<div id='end' class='range'/>");
        _$center = $("<div id='center' class='range'/>");
        me.$container.append(_$start);
        me.$container.append(_$end);
        me.$container.append(_$center);
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
        _$start.text(me.range[0]);
        _$end.text(me.range[1]);
        _$center.text(me.range[0] + parseInt((me.range[1] - me.range[0]) / 2));
        _$center.toggle(_$start.text() != _$center.text() && _$end.text() != _$center.text());
        me.setPosition(me.range[0], true);
    };
    
    me.setPosition = function(p_pos, p_forceChanged)
    {
        if (p_pos > me.range[1])
        {
            p_pos = me.range[1];
        }
        else if (p_pos < me.range[0])
        {
            p_pos = me.range[0];
        }
        
        if (me.position != p_pos || p_forceChanged)
        {
            me.position = p_pos;
            me.positionPercentage = (me.position - me.range[0]) / (me.range[1] - me.range[0]);
            me.update();
            
            _$label.text("#" + me.position);
            me.trigger("positionchanged");
        }
        return me.position;
    };
    
    me.setPositionPercentage = function(p_pos)
    {
        me.setPosition(parseInt(p_pos * (me.range[1] - me.range[0]) + me.range[0]));
    };
    
    me.update = function()
    {
        _$label.text(me.position);
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
        me.setPosition(me.position + 1, true);
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
    
    function _progressBar_onmousedown(e)
    {
        $(document.body).css({
            webkitUserSelect: "none"
        });
        $(document.body).on("mousemove", _progressBar_onmousemove);
        $(document.body).on("mouseup", _progressBar_onmouseup);
    }
    
    function _progressBar_onmousemove(e)
    {
        var percentage = _mouseX2Percentage(e);
        me.setPositionPercentage(percentage);
    }
    
    function _progressBar_onmouseup(e)
    {
        var percentage = _mouseX2Percentage(e);
        me.setPositionPercentage(percentage);
     
        $(document.body).css({
            webkitUserSelect: ""
        });
        $(document.body).off("mousemove", _progressBar_onmousemove);
        $(document.body).off("mouseup", _progressBar_onmouseup);
    }
    
    function _mouseX2Percentage(e)
    {
        var pos = (e.pageX - _$progressBar.offset().left + me.$container.offset().left - 22);
        var percentage = pos / (_$progressBar.width() - 15);
        return percentage;
    }

    return me.endOfClass(arguments);
};
