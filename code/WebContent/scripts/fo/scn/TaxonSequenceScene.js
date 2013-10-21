$ns("fo.scn");

$import("fo.view.TaxonSeqView3D");
$import("fo.view.ChronLineView");
$import("fo.view.GroupSwitchView");

$include("fo.res.TaxonSequenceScene.css");

fo.scn.TaxonSequenceScene = function()
{
    var me = $extend(mx.scn.Scene);
    me.autoFillParent = true;
    me.elementClass = "TaxonSequenceScene";
    var base = {};
    
    me.chronLineView = null;
    me.groupSwitchView = null;
    me.seqView = null;
    
    me.$mask = $("<div id=mask></div>");
    
    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
       
        me.initSeqView();
        me.$element.append(me.$mask);
        me.initChronLineView();
        me.initGroupSwitchView();
        
        me.$mask.hide();          
    };
    
    me.initSeqView = function()
    {
        me.seqView = new fo.view.TaxonSeqView3D({
            frame: {
                left: 0,
                top: 0,
                width: me.frame.width,
                height: me.frame.height - 0
            }
        });

        me.addSubview(me.seqView);
    };
    
    me.initChronLineView = function()
    {
    	var $table = $("<div id=chronLineView></div>");
    	$(document.body).append($table);
    	me.chronLineView = new fo.view.ChronLineView({
    		id:"chronLineView", 
    		$element:$table,
    		frame:{
    			width: me.frame.width,
    			top: 20   			
    		}
    		
    		
    	});
    	me.addSubview(me.chronLineView);
    	
    	me.chronLineView.hide();
    	
    };
    
    me.initGroupSwitchView = function()
    {
    	me.groupSwitchView = new fo.view.GroupSwitchView({
    		id: "groupSwitchView",
    		frame:{
    			top: 205,
    			right: 40
    		}
    	});
    	me.addSubview(me.groupSwitchView);
    	
    	me.groupSwitchView.hide();
    };

    
    base.activate = me.activate;
    me.activate = function(args, isPoppedBack)
    {
        base.activate(args, isPoppedBack);

        if (!isPoppedBack)
        {
            $("#projectLogo").fadeIn();
        }
        else
        {
            
        }
    };
    
    
    
    var _to2D = false;
    me.onKeydown = function(e)
    {
        if (!_to2D && (e.keyCode == 13 || e.keyCode == 32))
        {
            _to2D = true;
            me.seqView.startAnimation("To2D");
        }
        else if (e.keyCode == 34)
        {
            _to2D = true;
            me.seqView.startAnimation("To2D");
        }
    };

    return me.endOfClass(arguments);
};
