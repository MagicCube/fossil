$ns("fo.scn");

$import("fo.view.TaxonInfoView");
$import("fo.view.MapView");
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

    base.init = me.init;
    me.init = function(p_options)
    {
        me.frame = { width: window.innerWidth, height: window.innerHeight };
        base.init(p_options);
        
        _$title = $("<h1 id='title'>");
        me.$container.append(_$title);
    
        me.initInfoView();
        me.initMapView();
        me.initPlayControlView();
    };
    
    me.initInfoView = function()
    {
        me.infoView = fo.view.TaxonInfoView({
            frame: {
                top: 15,
                right: 15
            }
        });
        me.addSubview(me.infoView);
    };
    
    me.initMapView = function()
    {
        var $map = $("<div id='map'/>");
        $(document.body).append($map);
        me.mapView = new fo.view.MapView({
            id: "map",
            $element: $map,
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
            me.$container.css(args.frame);
            me.taxon = args.taxon;
            me.setTaxon(args.taxon);
        }
        else
        {
            
        }
    };
    
    me.setTaxon = function(p_taxon)
    {
        me.taxon = p_taxon;
        _$title.text(me.taxon.title);
        me.infoView.setTaxon(me.taxon);
    };
    
    me.onKeydown = function(e)
    {
        if (e.keyCode == 27)
        {
            fo.app.hidePoppedScene();
        }
    };

    return me.endOfClass(arguments);
};
