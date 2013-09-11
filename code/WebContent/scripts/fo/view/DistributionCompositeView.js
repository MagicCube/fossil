$ns("fo.view");


$import("fo.view.DistributionGlobeView3D");
$import("fo.view.DistributionHeatmapView");

$include("fo.res.DistributionCompositeView.css");

fo.view.DistributionCompositeView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "DistributionCompositeView";
    var base = {};
    
    me.dataSet = null;
    
    me.activeView = null;
    me.globeView = null;
    me.heatmapView = null;
    
    me.playControlView = null;
    
    var _$viewSwitcher = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        me.initDataSet();
        me.initViewSwitcher();
        if (me.playControlView != null)
        {
            me.setPlayControlView(me.playControlView);
        }
        me.switchView("heatmap");
    };
    
    me.initDataSet = function()
    {
        me.dataSet = [];
        for (var i = 0; i < fo.sections.length; i++)
        {
            var section = fo.sections[i];
            var row = { location: section.location, value: 0 };
            me.dataSet[section.id] = row;
            me.dataSet.add(row);
        }
    };
    
    me.initViewSwitcher = function()
    {
        _$viewSwitcher = $("<div id='viewSwitcher'>");
        _$viewSwitcher.on("click", function(){
            me.toggleView();
        });
        me.$container.append(_$viewSwitcher);
    };
    
    me.initGlobeView = function()
    {
        me.globeView = new fo.view.DistributionGlobeView3D({
            id: "globe",
            dataSet: me.dataSet,
            frame: {
                left: 0,
                top: 0,
                width: me.frame.width,
                height: me.frame.height
            }
        });
    };
    
    me.initHeatmapView = function()
    {
        var $map = $("<div id='map'/>");
        $(document.body).append($map);
        me.heatmapView = new fo.view.DistributionHeatmapView({
            id: "map",
            $element: $map,
            dataSet: me.dataSet,
            frame: {
                left: 0,
                right: 0,
                width: me.frame.width,
                height: me.frame.height
            }
        });
    };

    
    
    
    
    
    
    me.setPlayControlView = function(p_playControlView)
    {
        if (me.playControlView != null)
        {
            me.playControlView.off("positionchanged", _playControlView_onpositionchanged);
            me.playControlView = null;
        }
        
        if (p_playControlView != null)
        {
            me.playControlView = p_playControlView;
            me.playControlView.on("positionchanged", _playControlView_onpositionchanged);
        }
    };
    
    
    
    
    
    
    
    me.switchView = function(p_viewName)
    {
        if (me.playControlView != null)
        {
            me.playControlView.pause();
        }
        
        if (me.activeView != null)
        {
            var view = me.activeView;
            if (isFunction(view.deactivate))
            {
                view.deactivate();
            }
            view.$container.fadeOut(function(){
                me.removeSubview(view);
            });
        }
        
        if (p_viewName == "heatmap")
        {
            if (me.heatmapView == null)
            {
                me.initHeatmapView();
            }
            me.activeView = me.heatmapView;
            me.$container.removeClass("globe");
            me.$container.addClass("heatmap");
        }
        else if (p_viewName == "globe")
        {
            if (me.globeView == null)
            {
                me.initGlobeView();
            }
            me.activeView = me.globeView;
            me.$container.removeClass("heatmap");
            me.$container.addClass("globe");
        }
        
        me.addSubview(me.activeView);
        me.activeView.$container.fadeIn();
        if (isFunction(me.activeView.deactivate))
        {
            me.activeView.activate();
        }
    };
    
    me.toggleView = function()
    {
        if (me.activeView == me.heatmapView)
        {
            me.switchView("globe");
        }
        else
        {
            me.switchView("heatmap");
        }
    };
    
    
    
    
    
    
    function _playControlView_onpositionchanged(e)
    {
        if (me.activeView == null) return;
        
        _simulateDataSetChanges();
        me.activeView.updateDataSet();
    }
    
    function _simulateDataSetChanges()
    {
        for (var i = 0; i < me.dataSet.length; i++)
        {
            var row = me.dataSet[i];
            row.value = Math.round(Math.random());
        }
    }

    return me.endOfClass(arguments);
};
