 
var _AirKoreaLayer = function() {

	// private functions & variables
	var TAG = '[Air Korea LAYER]';
	var format = 'image/png';
	var akBaseUrl = '/geoserver/airkorea/wms';
	var akWFSUrl = '/geoserver/airkorea/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=airkorea:#lyrNm#&maxFeatures=100000&outputFormat=application%2Fjson&CQL_FILTER=';
	
	var createTileLayer = function(layerInfos) {
		var layers = [];
		
		for(var i=0; i<layerInfos.length; i++){
			var layer = new ol.layer.Tile({
      			visible: layerInfos[i].isVisible,
      			opacity : layerInfos[i].opacity,
      			source: new ol.source.TileWMS({
      				url: Common.geoServerUrl+akBaseUrl,
      				params: {'FORMAT': format, 
	      				'VERSION': '1.1.0',
	      				tiled: layerInfos[i].isTiled,
	      				LAYERS: 'airkorea:'+layerInfos[i].layerNm,
	      				CQL_FILTER:layerInfos[i].cql
	      				},
      				serverType:'geoserver'
      			}),
  				name: layerInfos[i].layerNm
			});
			if(layer != null){
				layer.set('layerNm', layerInfos[i].layerNm);
				layers.push(layer);
			}
		}
		return layers;
	};
	
	var getFeatures = function(lyrNm, filter, callback){
		var wfsUrl = akWFSUrl.replace('#lyrNm#', lyrNm);
		if(filter == null || filter == ''){
			filter = '1=1';
		}
		
		var formatter = new ol.format.GeoJSON();
		$.getJSON(Common.geoServerUrl+wfsUrl+filter, function(result){
//	    	callback.apply(this, [formatter.readFeatures(result)]);
			callback.apply(this, [result]);
	    });
	};
	
	var createPolygonFeatures = function(data, TAG, lineColor, fillColor, isInsp) {

		if(data == null)
			return [];
		
		var featureList = [];
		
		for(var i=0; i<data.length; i++){
			var item = data[i];
			item.TAG = TAG;
			var coords = [];
			coords[0] = [];
			item.keyNm = 'facName';
			var type = item.wkt.substring(0, item.wkt.indexOf('('));
			if(type.indexOf('MULTI')>-1){
				var src = item.wkt.substring((item.wkt.indexOf('(((')+3), item.wkt.indexOf(')))')).split('),(');	
				for(var j=0;j<src.length; j++){
					if(coords[0][j] == null)
						coords[0][j] = [];
					var linePoints = src[j].split(',');
					for(var z=0; z<linePoints.length; z++){
						var coord = linePoints[z].split(' ');
						if(coords[0][j][z] == null)
							coords[0][j][z] = [];
						coords[0][j][z][0] = parseFloat(coord[0]);
						coords[0][j][z][1] = parseFloat(coord[1]);	
					}
				}
			}else{
				var src = item.wkt.substring((item.wkt.indexOf('((')+2), item.wkt.indexOf('))')).split(',');	
				for(var j=0;j<src.length; j++){
					if(coords[0][j] == null)
						coords[0][j] = [];
					var coord= src[j].split(' ');
					
					coords[0][j][0] = parseFloat(coord[0]);
					coords[0][j][1] = parseFloat(coord[1]);
				}
			}
			
			var geometry;
			if(type == 'POLYGON'){
				geometry = new ol.geom.Polygon(coords);
			}else{
				geometry = new ol.geom.MultiPolygon(coords);	
			}
			
			var f = new ol.Feature({
				  geometry: geometry,
				  item: item
			});
			
			f.setStyle(new ol.style.Style({
		          stroke: new ol.style.Stroke({
		              color: lineColor,
		              width: 2
		            }),
		            fill: new ol.style.Fill({
		                  color: [153, 130, 44, 0.5]
		                })
		          }));
			
			featureList.push(f);
		}
		return featureList;
	};
	// public functions
	return {

		init : function() {
			var me = this;
			return me;
		},
		createTileLayer:function(layerInfos){
			return createTileLayer(layerInfos);
		},
		getFeatures: function(lyrNm, filter, callback){
			getFeatures(lyrNm, filter, callback);
		}
	};

}();
