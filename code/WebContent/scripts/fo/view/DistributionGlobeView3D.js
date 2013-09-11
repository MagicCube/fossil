$ns("fo.view");

$import("fo.view.GlobeView3D");

fo.view.DistributionGlobeView3D = function()
{
    var me = $extend(fo.view.GlobeView3D);
    me.isAnimating = true;
    me.antialias = false;
    var base = {};
    
    me.dataSet = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };
    
    me.activate = function()
    {
        me.startAnimation();
    };
    
    me.deactivate = function()
    {
        me.stopAnimation();
    };
    
    me.updateDataSet = function()
    {
        
    };

    return me.endOfClass(arguments);
};
