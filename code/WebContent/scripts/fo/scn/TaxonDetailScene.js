$ns("fo.scn");

$import("fo.view.TaxonInfoView");
$import("fo.view.DistributionCompositeView");
$import("fo.view.PlayControlView");

$include("fo.res.TaxonDetailScene.css");

fo.scn.TaxonDetailScene = function()
{
    var me = $extend(mx.scn.Scene);
    me.elementClass = "TaxonDetailScene";
    me.autoFillParent = true;
    var base = {};
    
    me.taxon = null;
    me.distributionView = null;
    me.playControlView = null;
    me.infoView = null;
    
    var _$title = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        var width = 1440;
        var height = 810;
        if (width > fo.app.frame.width - 80)
        {
            width = fo.app.frame.width - 80;
        }
        if (height > fo.app.frame.height - 80)
        {
            height = fo.app.frame.height - 80;
        }
        me.frame = { width: width, height: height };
        base.init(p_options);
        
        me.initTitle();
        me.initInfoView();
        me.initPlayControlView();
        me.initDistributionView();
    };
    
    me.initTitle = function()
    {
        _$title = $("<h1 id='title'>");
        me.$container.append(_$title);
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

    me.initDistributionView = function()
    {
        me.distributionView = new fo.view.DistributionCompositeView({
            playControlView: me.playControlView,
            frame: {
                left: 0,
                top: 0,
                width: me.frame.width,
                height: me.frame.height
            }
        });
        me.addSubview(me.distributionView);
    };
    
    me.initPlayControlView = function()
    {
        me.playControlView = new fo.view.PlayControlView({
            drivenMode: "timer",
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
            me.distributionView.activate();
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
        me.distributionView.deactivate();
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
        else if (e.keyCode == 39 || e.keyCode == 40)
        {
            me.playControlView.pause();
            me.playControlView.moveToNextFrame();
            e.stopPropagation();
            e.preventDefault();
        }
        else if (e.keyCode == 37 || e.keyCode == 38)
        {
            me.playControlView.pause();
            me.playControlView.moveToPreviousFrame();
            e.stopPropagation();
            e.preventDefault();
        }
    };

    return me.endOfClass(arguments);
};
