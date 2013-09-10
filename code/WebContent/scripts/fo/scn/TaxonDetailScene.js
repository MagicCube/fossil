$ns("fo.scn");

$import("fo.view.TaxonInfoView");
$import("fo.view.HeatmapView");
$import("fo.view.PlayControlView");

$include("fo.res.TaxonDetailScene.css");

fo.scn.TaxonDetailScene = function()
{
    var me = $extend(mx.scn.Scene);
    me.elementClass = "TaxonDetailScene";
    me.autoFillParent = true;
    var base = {};
    
    me.taxon = null;
    me.mapView = null;
    me.playControlView = null;
    me.infoView = null;
    
    var _$title = null;
    var _$dimension = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        me.frame = { width: fo.app.frame.width, height: fo.app.frame.height };
        base.init(p_options);
        
        me.initTitle();
        me.initDimension();
        me.initInfoView();
        me.initPlayControlView();
        me.initMapView();
    };
    
    me.initTitle = function()
    {
        _$title = $("<h1 id='title'>");
        me.$container.append(_$title);
    };
    
    me.initDimension = function()
    {
        _$dimension = $("<h1 id='dimension'>");
        me.$container.append(_$dimension);
    };
    
    me.initInfoView = function()
    {
        me.infoView = fo.view.TaxonInfoView({
            frame: {
                top: 15,
                left: 15
            }
        });
        me.addSubview(me.infoView);
    };
    
    me.initMapView = function()
    {
        var $map = $("<div id='map'/>");
        $(document.body).append($map);
        me.mapView = new fo.view.HeatmapView({
            id: "map",
            $element: $map,
            playControlView: me.playControlView,
            frame: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        });
        me.addSubview(me.mapView);
    };
    
    me.initPlayControlView = function()
    {
        me.playControlView = new fo.view.PlayControlView({
            frame: { bottom: 10, left: 10, right: 10 } 
        });
        me.addSubview(me.playControlView);
    };

    base.activate = me.activate;
    me.activate = function(args, isPoppedBack)
    {
        base.activate(args, isPoppedBack);

        if (!isPoppedBack)
        {
            me.setTaxon(args.taxon);
        }
        else
        {
            
        }
    };
    
    base.deactivate = me.deactivate;
    me.deactivate = function()
    {
        base.deactivate();
        
        me.playControlView.pause();
    };
    
    me.setTaxon = function(p_taxon)
    {
        me.taxon = p_taxon;
        _$title.text(me.taxon.title);
        me.infoView.setTaxon(me.taxon);
        me.playControlView.setRange([me.taxon.start, me.taxon.end]);
    };
    
    me.onKeydown = function(e)
    {
        if (e.keyCode == 27)
        {
            fo.app.hidePoppedScene();
        }
        else if (e.keyCode == 13 || e.keyCode == 32)
        {
            me.playControlView.togglePlay();
        }
    };

    return me.endOfClass(arguments);
};
