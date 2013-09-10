$ns("fo");

$import("lib.three.Three", function(){
    $import("lib.three.control.TrackballControls");
    $import("lib.three.renderer.CSS3DRenderer");
});
$import("lib.d3.D3");
$import("lib.jquery.plugin.Transit");
$import("lib.tween.Tween");

$import("fo.view.SearchBoxView");

$import("fo.scn.TaxonDetailScene");
$import("fo.scn.DiversityScene");
$import("fo.scn.OverviewScene");
$import("fo.scn.WelcomeScene");

$include("fo.res.App.css");

fo.App = function()
{
    var me = $extend(mx.app.Application);
    me.appId = "fo.App";
    me.appDisplayName = "The Fossil Project";
    var base = {};
    
    me.scenes = [];
    me.rootScene = null;
    me.activeScene = null;
    me.poppedScene = null;
    me.homeSceneName = "Welcome";
    
    me.taxons = [];
    me.sections = [];
    
    me.searchBoxView = null;
    
    var _$background = null;
    var _$overlay = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        me.frame = { width: window.innerWidth, height: window.innerHeight };
        base.init(p_options);
        
        me.initBackground();
        me.initOverlay();
        me.loadTaxons();
        me.loadSections();
        me.initSearchBoxView();
        
        me.$container.on("mousewheel", function(e)
        {
            e.preventDefault();
        });
    };
    
    me.initBackground = function()
    {
        _$background = $("<img id='background' src='" + mx.getResourcePath("fo.res.images.background", "jpg") + "'>");
        me.$container.append(_$background);
    };
    
    me.initOverlay = function()
    {
        _$overlay = $("<div id='overlay'/>");
        _$overlay.on("click", function(e)
        {
            if (e.target == _$overlay.get(0))
            {
                me.hidePoppedScene();
            }
        });
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
    
    
    me.loadTaxons = function()
    {
        $.ajax({
            url: $mappath("~/data/taxons.json"),
            async: false
        }).success(function(taxons)
        {
            fo.taxons = [];
            for (var i = 0; i < taxons.length; i++)
            {
                var taxon = taxons[i];
                fo.taxons.add(taxon);
                fo.taxons[taxon.id] = taxon;
            }
            fo.taxons = fo.taxons.sort(function(a, b)
            {
                return a.start - b.start;
            });
        });
    };
    
    me.loadSections = function()
    {
        $.ajax({
            url: $mappath("~/data/sections.json"),
            async: false
        }).success(function(sections)
        {
            fo.sections = [];
            for (var i = 0; i < sections.length; i++)
            {
                var section = sections[i];
                fo.sections[section.id] = section;
                fo.sections.add(section);
            }
        });
    };

    base.run = me.run;
    me.run = function(args)
    {
        me.setRootScene(me.homeSceneName);
        //me.setRootScene("TaxonDetail", { taxon: fo.taxons[0], frame: { left: 0, right: 0 } });
    };
    
    
    $(document).on("keydown", function(e)
    {
        if (me.activeScene != null && isFunction(me.activeScene.onKeydown))
        {
            me.activeScene.onKeydown(e);
        }
    });
    
    
    
    me.getScene = function(p_sceneId, p_isRootScene)
    {
        var scene = me.scenes[p_sceneId];
        if (scene == null)
        {
            var cls = fo.scn[p_sceneId + "Scene"];
            var frame = null;
            if (p_isRootScene)
            {
                frame = {
                    left: 0,
                    top: 0,
                    width: me.frame.width,
                    height: me.frame.height
                };
            }
            scene = new cls({
                id: p_sceneId,
                frame: frame
            });
            me.scenes[p_sceneId] = scene;
            me.scenes.add(scene);
        }
        return scene;
    };
    
    me.setRootScene = function(p_sceneId, args)
    {
        var scene = me.getScene(p_sceneId, true);
        if (me.activeScene != null)
        {
            me.activeScene.deactivate();
            me.activeScene.$container.detach();
            me.activeScene = null;
        }
        scene.$container.addClass("root");
        me.$container.append(scene.$container);
        me.rootScene = scene;
        me.activeScene = scene;
        scene.activate(args, false);
    };
    
    me.popupScene = function(p_sceneId, args)
    {
        var scene = me.getScene(p_sceneId);
        if (me.activeScene != null)
        {
            me.activeScene.deactivate();
            me.activeScene = null;
        }
        me.searchBoxView.$container.fadeOut();
        scene.$container.addClass("popped");
        _$overlay.hide();
        me.$container.append(_$overlay);
        $("#projectLogo").transit({
            opacity: 0
        });
        _$overlay.fadeIn();
        me.$container.append(scene.$container);
        me.poppedScene = scene;
        me.activeScene = scene;
        scene.activate(args, false);
        scene.$container.css({ scale: 4, opacity: 0 });
        scene.$container.transit({
            opacity: 1,
            scale: 1,
            left: (window.innerWidth - scene.frame.width) / 2,
            top: (window.innerHeight - scene.frame.height) / 2,
            width: scene.frame.width,
            height: scene.frame.height
        }, 400, "ease");
        return scene;
    };
    
    me.hidePoppedScene = function()
    {
        if (me.poppedScene != null)
        {
            var poppedScene = me.poppedScene;
            _$overlay.fadeOut(function(){
                _$overlay.detach();
            });
            me.poppedScene.deactivate();
            me.poppedScene.$container.transit({
                opacity: 0,
                scale: 0.2
            }, 300, "ease", function(){
                poppedScene.$container.detach();
            });
            me.poppedScene.$container.removeClass("popped");
            me.poppedScene = null;
            me.activeScene = null;
            if (me.rootScene != null)
            {
                me.activateScene = me.rootScene;
                me.activateScene.activate({}, true);
            }
            me.searchBoxView.$container.fadeIn();
            $("#projectLogo").transit({ opacity: 1 }, 2000);
        }
    };

    return me.endOfClass(arguments);
};
