$ns("fo.geo");


fo.geo.Segment = function()
{
    var me = $extend(MXObject);
    var base = {};
    
    me.a = null;
    me.b = null;

    base._ = me._;
    me._ = function(p_options)
    {
        if (me.canConstruct())
        {
            base._(p_options);
        }
    };


    return me.endOfClass(arguments);
};
