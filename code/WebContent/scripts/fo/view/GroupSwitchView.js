$ns("fo.view");

$include("fo.res.GroupSwitchView.css");

fo.view.GroupSwitchView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "GroupSwitchView";
    var base = {};
    
    me.group = null; //selected group-by, no selection initially
    
    me.ongroupchanged = null;
    

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        me.$element.append("<span id='groupBy'>Group By - </span><ul><li id='class'>Class</li><li id='genus'>Genus</li></ul>");
        me.$element.find("li").on("click", _li_onclick);
        
    };
    
    //Fire groupchanged event out of the current view to share with other objects
    me.setGroup = function(p_group)
    {
      	me.group = p_group;
      	me.$element.find(".selected").removeClass("selected");
      	if (me.group != null)
  		{
      		me.$element.find("#" + me.group).addClass("selected");
  		}
    	me.trigger("groupchanged");
    };
    
  
    //update group style and change group focus handler
    function _li_onclick(e)
    {
     	var groupClicked = e.target.id;
     	me.setGroup(me.group == groupClicked ? null : groupClicked);
  
    }

    return me.endOfClass(arguments);
};