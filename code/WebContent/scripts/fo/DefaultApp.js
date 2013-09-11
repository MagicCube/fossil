$ns("fo");

$import("fo.BaseApp");
$import("fo.view.SearchBoxView");
$import("fo.scn.OverviewScene");
$import("fo.scn.TaxonDetailScene");
$import("fo.scn.WelcomeScene");

fo.DefaultApp = function()
{
    var me = $extend(fo.BaseApp);
    me.homeSceneName = "Welcome";
    var base = {};
    
    me.searchBoxView = null;
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.initSearchBoxView();
    };

    me.initSearchBoxView = function()
    {
        me.searchBoxView = new fo.view.SearchBoxView({
            frame: {
                left: 0,
                top: 0
            }
        });
        me.searchBoxView.hide();
        me.addSubview(me.searchBoxView);
    };
    
    return me.endOfClass(arguments);
};
