$ns("fo");

$import("lib.three.Three", function(){
    $import("lib.three.control.TrackballControls");
    $import("lib.three.renderer.CSS3DRenderer");
});
$import("lib.d3.D3");
$import("lib.jquery.plugin.Transit");
$import("lib.tween.Tween");
//$import("fo.data.DiversityDataSource");
$import("fo.util.ChronUtil");
$import("fo.util.GroupUtil");

$include("fo.res.DefaultApp.css");

fo.BaseApp = function()
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
       // me.loadTaxons();
        me.loadTaxa();
        me.loadSections();
        me.loadDiversityCurve();

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
        });
    };

    me.loadTaxa = function()
    {
        $.ajax({
            url: $mappath("~/data/taxa.json"),
            async: false
        }).success(function(fossil)
        {
            fo.taxa = [];
            fo.first = fossil.first;
            fo.last = fossil.last;
            var taxa = fossil.taxa;
            for (var i = 0; i < taxa.length; i++)
            {
                var taxon = taxa[i];

                fo.taxa.add(taxon);
                fo.taxa[taxon.id] = taxon;

            }

            //console.log(fo.taxa);

        });
    };

    me.loadDiversityCurve = function()
    {
    	$.ajax({
    		url: $mappath("~/data/curve.json"),
    		data: {class: "GetExplicitCurve"},
    		async: false
    	}).success(function(curve)
    	{
    		fo.diverCurve = [];

    		for(var i = 0; i < curve.length; i ++)
    		{
    			var diver =  curve[i];

    			fo.diverCurve.add(diver);
    		}

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
               // section.id = "s" + (i + 1);
                fo.sections[section.id] = section;
                fo.sections.add(section);
            }
            //console.log(JSON.stringify(fo.sections));
        });
    };

    base.run = me.run;
    me.run = function(args)
    {
        me.setRootScene(me.homeSceneName, { taxon: fo.taxa[0], frame: { left: 0, right: 0 } });
    };


    $(document).on("keydown", function(e)
    {
        if (e.keyCode == 190)
        {
            window.location.reload(false);
        }
        else if (me.activeScene != null && isFunction(me.activeScene.onKeydown))
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
            console.log(p_sceneId + "Scene");
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
        //me.searchBoxView.$container.fadeOut();
        scene.$container.addClass("popped");
        _$overlay.hide();
        me.$container.append(_$overlay);
        _$overlay.fadeIn();
        me.$container.append(scene.$container);
        me.poppedScene = scene;
        me.activeScene = scene;
        scene.activate(args, false);
        //$("#projectLogo").fadeOut();
        scene.$container.css({ scale: 0.2, opacity: 0, left: (me.frame.width - scene.frame.width) / 2, top: (me.frame.height - scene.frame.height) / 2, });
        scene.$container.transit({
            scale: 1,
            opacity: 1,
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
            //$("#projectLogo").fadeIn();
            //me.searchBoxView.$container.fadeIn();
        }
    };

    me.showOverlay = function()
    {
        _$overlay.fadeIn();
    };

    me.hideOverlay = function()
    {
        _$overlay.fadeOut();
    };

    return me.endOfClass(arguments);
};
