$ns("fo");

$import("fo.BaseApp");
$import("fo.view.SearchBoxView");
$import("fo.scn.TaxonSequenceScene");
$import("fo.scn.TaxonDetailScene");
$import("fo.scn.WelcomeScene");
$import("fo.scn.BioDiversityScene");

fo.DefaultApp = function()
{
    var me = $extend(fo.BaseApp);
    me.homeSceneName = "Welcome";
    var base = {};
    
    me.searchBoxView = null;
    
    me.topMove = 208;
    me.leftMove = 200;
    
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
                left: me.leftMove,
                top: me.topMove
            }
        });
        me.searchBoxView.hide();
        me.addSubview(me.searchBoxView);
    };
    
    return me.endOfClass(arguments);
};
