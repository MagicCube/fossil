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
		for (var i = 0; i < fo.taxa.length; i++)
        {
            var taxon = fo.taxa[i];
            var group = null;
            var key = null;
            
            if(taxon.cls)
            {
            	key = taxon.cls;
            }
            else
            {
            	
            	key = "Unkown";
            }
            
            if (groups[key] == null)
            {
  
            	group = {
            		name: key,
            		taxa: []
            	};
            	groups.add(group);
            	groups[group.name] = group;
            }
            else
        	{            
            	group = groups[key];
        	}
            group.taxa.add(taxon);
        }
		return groups;
    };
    
    me.getGenusTaxaGroups = function()
    {
		var groups = [];
		for (var i = 0; i < fo.taxa.length; i++)
        {
            var taxon = fo.taxa[i];
            var group = null;
            var key = null;
            
            if(taxon.cls)
            {
            	key = taxon.cls + " - " + taxon.genus;
            }
            else
            {
            	key = "Unknown" + " - " + taxon.genus;
            }
            
            if (groups[key] == null)
            {
            
            	group = {
            		name: key,
            		taxa: []
            	};
            	groups.add(group);
            	groups[group.name] = group;
            }
            else
        	{
            
            	group = groups[key];
        	}
            group.taxa.add(taxon);
        }
		return groups;
    };
    	
 

    return me.endOfClass(arguments);
};

fo.util.GroupUtil = new fo.util.GroupUtilClass();
