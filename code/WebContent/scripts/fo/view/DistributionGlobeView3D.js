$ns("fo.view");

$import("fo.view.GlobeView3D");

fo.view.DistributionGlobeView3D = function()
{
    var me = $extend(fo.view.GlobeView3D);
    me.isAnimating = true;
    me.antialias = false;
    me.maxLineLength = 1;
    var base = {};

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
    };
    
    me.activate = function()
    {
        me.startAnimation();
        me.updateDataSet();
    };
    
    me.deactivate = function()
    {
        me.stopAnimation();
    };
    
    
    me.updateDataSet = function()
    {
        me.setDataSet(me.dataSet, 1);
        me.render();
    };
    
    me.colorScale = function(x)
    {
        var c = new THREE.Color();
        if (x == 0)
        {
            c.setRGB(0, 0, 0);
        }
        else
        {
            c.setRGB(0, 0, 255);
        }
        return c;
    };

    return me.endOfClass(arguments);
};
