L.TileLayer.WebGLHeatmap = L.Class.extend({

    options: {
        size: 15000,
        opacity: 1,
    },
    
    initialize: function(options){
        this.data = [];
        L.Util.setOptions(this, options);
    },
    
    onAdd: function(map) {
        this.map = map;
        this.options.tileSize = 256;
        
        var container = document.getElementsByClassName('leaflet-overlay-pane')[0];
        var canv = this._canvas = document.createElement("canvas");
        canv.width = this.map.getSize().x;
        canv.height = this.map.getSize().y;
        canv.style.opacity = this.options.opacity;
        container.appendChild(canv);
        
        this.heatmap = createWebGLHeatmap({canvas: canv});
        
        map.on("moveend", this._redraw, this);
        this._redraw();
    },

    onRemove: function(map) {
        map.getPanes().overlayPane.removeChild(this._canvas);
        map.off("moveend", this._redraw, this);
    },

    addData: function(lat, lon, value) {
        this.data.push({"lat":lat, "lon":lon, "v":value/1000});
        return this;
    },
    
    _scale: function (point) {
        var nwPoint = point.multiplyBy(this.options.tileSize);
        var centerPoint = nwPoint.add(new L.Point(this.options.tileSize/2, this.options.tileSize/2));
        this._latlng = this.map.unproject(centerPoint);
        var lngRadius = ((this.options.size / 40075017) * 360) / Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat),
            latlng2 = new L.LatLng(this._latlng.lat, this._latlng.lng - lngRadius, true),
            point2 = this.map.latLngToLayerPoint(latlng2),
            point = this.map.latLngToLayerPoint(this._latlng);
        this._radius = Math.max(Math.round(point.x - point2.x), 12);
    },
    
    _redraw: function() {
        L.DomUtil.setPosition(this._canvas, this.map.latLngToLayerPoint(this.map.getBounds().getNorthWest()));
        this.heatmap.clear();
        var tiles = this.map._layers[24]._tiles;
        var tileSizes = [];
        for(size in tiles){
            tileSizes.push(size);
        }
        var point = tileSizes.pop().split(':');
        point = new L.Point(parseInt(point[0]), parseInt(point[1]));
        this._scale(point);
        if (this.data.length > 0) {
            for (var i=0, l=this.data.length; i<l; i++) {
                var lonlat = new L.LatLng(this.data[i].lat, this.data[i].lon);
                var point = this.map.latLngToLayerPoint(lonlat);
                point = this.map.layerPointToContainerPoint(point);
                var xoff = Math.random()*2-1;
                var yoff = Math.random()*2-1;
                
                this.heatmap.addPoint(
                        Math.floor(point.x+xoff*50),
                        Math.floor(point.y+yoff*50),
                        100, 
                        this.data[i].v);
            }
            this.heatmap.update();
            this.heatmap.display();
        }
        return this;
    }
});
