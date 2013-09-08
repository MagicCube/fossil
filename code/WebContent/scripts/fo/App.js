$ns("fo");

$import("lib.three.Three", function(){
    $import("lib.three.control.TrackballControls");
    $import("lib.three.renderer.CSS3DRenderer");
});
$import("lib.d3.D3");
$import("lib.jquery.plugin.Transit");
$import("lib.tween.Tween");

$import("fo.view.SearchBoxView");

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
    me.activeScene = null;
    
    me.searchBoxView = null;
    
    var _$background = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.initBackground();
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
            window.$taxons = [];
            var lines = e.split("\n");
            for (var i = 0; i < 1200; i++)
            {
                var line = lines[i];
                var id = line.substr(0, 10);
                var taxon = {
                    id: id,
                    name: line.substr(17, 8).replace(".1111", ""),
                    fullName: line.substr(39, 24).trim() + " " + line.substr(64, 23).trim()
                };
                $taxons.add(taxon);
            }
        });
    };

    base.run = me.run;
    me.run = function(args)
    {
        me.setRootScene("Welcome");
        //me.setRootScene("Overview");
        //me.setRootScene("Diversity");
    };
    
    
    $(document).on("keydown", function(e)
    {
        if (me.activeScene != null && isFunction(me.activeScene.onKeydown))
        {
            me.activeScene.onKeydown(e);
        }
    });
    
    
    
    me.getScene = function(p_sceneId)
    {
        var scene = me.scenes[p_sceneId];
        if (scene == null)
        {
            var cls = fo.scn[p_sceneId + "Scene"];
            scene = new cls({
                id: p_sceneId,
                frame: {
                    left: 0,
                    top: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            });
            me.scenes[p_sceneId] = scene;
            me.scenes.add(scene);
        }
        return scene;
    };
    
    me.setRootScene = function(p_sceneId, args)
    {
        var scene = me.getScene(p_sceneId);
        if (me.activeScene != null)
        {
            me.activeScene.deactivate();
            me.activeScene.$container.detach();
            me.activeScene = null;
        }
        me.$container.append(scene.$container);
        me.activeScene = scene;
        scene.activate(args, false);
    };

    return me.endOfClass(arguments);
};
