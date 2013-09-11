$ns("fo.view");

$include("fo.res.TaxonInfoView.css");

fo.view.TaxonInfoView = function()
{
    var me = $extend(mx.view.View);
    me.elementClass = "TaxonInfoView";
    var base = {};
    
    me.taxon = null;
    
    var _$name = null;
    var _$detailList = null;

    base.init = me.init;
    me.init = function(p_options)
    {
        base.init(p_options);
        
        _$name = $("<h1 id='name'>Schizolus dubiiformis</h1>");
        me.$container.append(_$name);
        
        _initDetailList();
    };
    
    function _initDetailList()
    {
        _$detailList = $("<div id='detailList'/>");
        //_$detailList.append("<dl><dt>Rank:</dt> <dd id='rank'>#1</dd></dl>");
        _$detailList.append("<dl><dt>Class:</dt> <dd id='cls'>Bivalvia</dd></dl>");
        _$detailList.append("<dl><dt>Genus:</dt> <dd id='genus'>Palaeoneilo</dd></dl>");
        _$detailList.append("<dl><dt>Author:</dt> <dd id='author'>Li Xin</dd></dl>");
        me.$container.append(_$detailList);
    }
    
    me.setTaxon = function(p_taxon)
    {
        me.taxon = p_taxon;
        _setProps({
            name: p_taxon.fullName,
            rank: "#" + (fo.taxons.indexOf(p_taxon) + 1),
            cls: p_taxon.cls,
            genus: p_taxon.genus,
            author: p_taxon.author + "(" + p_taxon.year + ")",
        });
    };
    
    function _setProps(p_json)
    {
        for (var k in p_json)
        {
            _setProp(k, p_json[k]);
        }
    }
    
    function _setProp(p_name, p_value)
    {
        me.$container.find("#" + p_name).text(p_value ? p_value : "N/A");
    }

    return me.endOfClass(arguments);
};
