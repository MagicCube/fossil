$ns("fo.util");


fo.util.GroupUtilClass = function()
{
    var me = $extend(MXObject);
    var base = {};
    
    base._ = me._;
    me._ = function(p_options)
    {
        if (me.canConstruct())
        {
            base._(p_options);

            // TODO add your own construction code here.
        }
    };

    
    me.getClsTaxaGroups = function()
    {
		var groups = [];
		for (var i = 0; i < fo.taxons.length; i++)
        {
            var taxon = fo.taxons[i];
            var group = null;
            var key = taxon.cls;
            if (groups[key] == null)
            {
            	// 创建新的
            	group = {
            		name: taxon.cls,
            		taxa: []
            	};
            	groups.add(group);
            	groups[group.name] = group;
            }
            else
        	{
            	// 用老的
            	group = groups[key];
        	}
            group.taxa.add(taxon);
        }
		return groups;
    };
    
    me.getGenusTaxaGroups = function()
    {
		var groups = [];
		for (var i = 0; i < fo.taxons.length; i++)
        {
            var taxon = fo.taxons[i];
            var group = null;
            var key = taxon.cls + " - " + taxon.genus;
            if (groups[key] == null)
            {
            	// 创建新的
            	group = {
            		name: key,
            		taxa: []
            	};
            	groups.add(group);
            	groups[group.name] = group;
            }
            else
        	{
            	// 用老的
            	group = groups[key];
        	}
            group.taxa.add(taxon);
        }
		return groups;
    };
    	
 

    return me.endOfClass(arguments);
};

fo.util.GroupUtil = new fo.util.GroupUtilClass();
