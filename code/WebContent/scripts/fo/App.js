$ns("fo");

$import("lib.three.Three", function(){
    $import("lib.three.control.TrackballControls");
    $import("lib.three.renderer.CSS3DRenderer");
});
$import("lib.d3.D3");
$import("lib.jquery.plugin.Transit");
$import("lib.tween.Tween");

$import("fo.view.SearchBoxView");

$import("fo.scn.DetailScene");
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
    
    me.searchBoxView = null;
    
    var _$background = null;
    var _$overlay = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.initBackground();
        me.initOverlay();
        me.loadTaxons();
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
            url: $mappath("~/data/taxon.txt"),
            async: false
        }).success(function(e)
        {
            fo.taxons = [];
            var lines = e.split("\n");
            for (var i = 0; i < 1200; i++)
            {
                var line = lines[i];
                var id = "t" + line.substr(1, 10);
                var taxon = {
                    id: id,
                    name: line.substr(17, 8).replace(".1111", ""),
                    fullName: line.substr(39, 24).trim() + " " + line.substr(64, 23).trim().replace("1", "")
                };
                taxon.start = parseInt(Math.random() * (i < 1800 ? i : 1800));
                taxon.end = taxon.start + parseInt(Math.random() * 600);
                fo.taxons.add(taxon);
                fo.taxons[id] = taxon;
            }
            fo.taxons = fo.taxons.sort(function(a, b)
            {
                return a.start - b.start;
            });
        });
    };

    base.run = me.run;
    me.run = function(args)
    {
        me.setRootScene(me.homeSceneName);
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
                    width: window.innerWidth,
                    height: window.innerHeight
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
        _$overlay.fadeIn();
        me.$container.append(scene.$container);
        me.poppedScene = scene;
        me.activeScene = scene;
        scene.activate(args, false);
        scene.$container.css({ opacity: 0 });
        scene.$container.transit({
            opacity: 1,
            left: (window.innerWidth - scene.frame.width) / 2,
            top: (window.innerHeight - scene.frame.height) / 2,
            width: scene.frame.width,
            height: scene.frame.height
        });
        return scene;
    };
    
    me.hidePoppedScene = function()
    {
        if (me.poppedScene != null)
        {
            _$overlay.fadeOut(function(){
                _$overlay.detach();
            });
            me.poppedScene.deactivate();
            me.poppedScene.$container.detach();
            me.poppedScene.$container.removeClass("popped");
            me.poppedScene = null;
            me.activeScene = null;
            if (me.rootScene != null)
            {
                me.activateScene = me.rootScene;
                me.activateScene.activate({}, true);
            }
            me.searchBoxView.$container.fadeIn();
        }
    };

    return me.endOfClass(arguments);
};
