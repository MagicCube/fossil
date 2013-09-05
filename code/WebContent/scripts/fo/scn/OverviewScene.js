$ns("fo.scn");

$import("fo.view.TaxonSeqChartView");

$include("fo.res.OverviewScene.css");

fo.scn.OverviewScene = function()
{
    var me = $extend(mx.scn.Scene);
    me.autoFillParent = true;
    me.elementClass = "OverviewScene";
    var base = {};
    
    me.chartView = null;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.initChartView();
    };
    
    me.initChartView = function()
    {
        me.chartView = new fo.view.TaxonSeqChartView({
            frame: {
                left: 0,
                top: 0,
                width: me.frame.width,
                height: me.frame.height - 0
            }
        });
        me.addSubview(me.chartView);
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

    return me.endOfClass(arguments);
};
