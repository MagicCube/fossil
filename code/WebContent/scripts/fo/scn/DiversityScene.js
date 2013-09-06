$ns("fo.scn");

$import("fo.view.GlobeView3D");

$include("fo.res.DiversityScene.css");

fo.scn.DiversityScene = function()
{
    var me = $extend(mx.scn.Scene);
    me.title = "";
    me.autoFillParent = true;
    var base = {};
    
    me.globeView = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        me.initGlobeView();
    };
    
    me.initGlobeView = function()
    {
        me.globeView = new fo.view.GlobeView3D({
            frame: {left: 0,
                    top: 0,
                    width: me.frame.width,
                    height: me.frame.height}
        });
        me.addSubview(me.globeView);
        
        d3.tsv($mappath("~/data/section.txt"), function(e) { 
            var data = [];
            for (var i = 0; i < e.length; i++)
            {
                var row = e[i];
                data.add({
                    value: parseInt(row.id),
                    location: {
                        lng: parseFloat(row.lng),
                        lat: parseFloat(row.lat)
                    }
                });
            }
            console.log(data);
            me.globeView.addData(data);
        });
    };

    base.activate = me.activate;
    me.activate = function(args, isPoppedBack)
    {
        base.activate(args, isPoppedBack);

        if (!isPoppedBack)
        {
            $("#projectLogo").fadeIn();
            me.globeView.startAnimation();
        }
        else
        {
            
        }
    };

    return me.endOfClass(arguments);
};
