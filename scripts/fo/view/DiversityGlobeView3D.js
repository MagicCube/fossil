$ns("fo.view");

$import("fo.view.GlobeView3D");
$import("fo.view.PlayControlView");

fo.view.DiversityGlobeView3D = function()
{
    var me = $extend(fo.view.GlobeView3D);
    me.maxLineLength = 40;
    me.antialias = false;
    var base = {};

    me.playControlView = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        me.initDataSet();
        if (me.playControlView != null)
        {
            me.setPlayControlView(me.playControlView);
        }
        _playControlView_onpositionchanged();
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


    function _playControlView_onpositionchanged(e)
    {
        if (me.animationFrameIndex === undefined)
        {
            me.animationFrameIndex = 0;
        }
        else
        {
            me.animationFrameIndex++;
        }
        if (me.animationFrameIndex > 5)
        {
            me.animationFrameIndex = 0;
        }
        if (me.animationFrameIndex === 0)
        {
            _simulateDataSetChanges();
            me.setData(me.dataSet);
            me.render();
        }
    }

    function _simulateDataSetChanges()
    {
        for (var i = 0; i < me.dataSet.length; i++)
        {
            var row = me.dataSet[i];
            row.value = Math.random() * 200;
        }
    }

    return me.endOfClass(arguments);
};
