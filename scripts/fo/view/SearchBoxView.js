$ns("fo.view");

$include("fo.res.SearchBoxView.css");

fo.view.SearchBoxView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "SearchBoxView";
    me.frame = { width: 550 };
    var base = {};
    
    me.text = "";
    me.delegate = null;
    
    me.onchanged = null;
    
    var _$input = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.$container.append("<div id='head'>搜索</div><input/>");
        _$input = me.$container.children("input");
        _$input.on("keydown", _input_onkeydown);
        _$input.on("blur", _input_onbblur);
        
        $(document.body).on("keydown", _document_onkeydown);
    };
    
    
    var _timer = null;
    function _resetTimer()
    {
        if (_timer != null)
        {
            clearTimeout(_timer);
            _timer = null;
        }
        _timer = setTimeout(_timer_ontick, 800);
    }
    
    function _timer_ontick(e)
    {
        if (me.text != _$input.val())
        {
            me.text = _$input.val();
            me.trigger("changed");
            if (me.delegate != null && isFunction(me.delegate.search))
            {
                me.delegate.search(me.text, me);
            }
        }
    }

    

    
    function _document_onkeydown(e)
    {
        if (e.keyCode >= 48 && e.keyCode <= 90)
        {
            _$input.val("");
            _$input.focus();
            $(document.body).off("keydown", _document_onkeydown);
            _resetTimer();
        }
    }
    
    function _input_onkeydown(e)
    {
        _resetTimer();
        if (e.keyCode == 27)
        {
            if (_$input.val() != "")
            {
                _$input.val("");
            }
            else
            {
                _$input.blur();
            }
        }
    }
    
    function _input_onbblur(e)
    {
        $(document.body).on("keydown", _document_onkeydown);
    }
    

    return me.endOfClass(arguments);
};
