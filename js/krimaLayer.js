var ctx = Common != null ? Common.ctx : '/android_asset/www/';
		
var _SimbolRes = new function()
{
	this.PIN   = {icon:ctx+'images/map/ic_pin_0', type:'.png'};
	this.PIN_C = {icon:this.PIN.icon, type:'_c.png'}
	
	this.F270   = {icon:ctx+'images/map/ic_pin_draingate', type:'.png'};
	this.F270_C = {icon:this.F270.icon, type:'_c.png'}
	
	this.F521   = {icon:ctx+'images/map/ic_pin_dpump', type:'.png'};
	this.F521_C = {icon:this.F521.icon, type:'_c.png'}
	
	this.F271   = {icon:ctx+'images/map/ic_pin_drainpipe', type:'.png'};
	this.F271_C = {icon:this.F271.icon, type:'_c.png'}

	this.F400   = {icon:ctx+'images/map/ic_pin_irridam', type:'.png'};
	this.F400_C = {icon:this.F400.icon, type:'_c.png'}

	this.F520   = {icon:ctx+'images/map/ic_pin_pumpdrain', type:'.png'};
	this.F520_C = {icon:this.F520.icon, type:'_c.png'}

	this.F590   = {icon:ctx+'images/map/ic_pin_else0', type:'.png'};
	this.F590_C = {icon:this.F590.icon, type:'_c.png'}

	this.Jlist   = {icon:ctx+'images/map/ic_pin_bank', type:'.png'};
	this.Jlist_C = {icon:this.Jlist.icon, type:'_c.png'}

	this.Blist   = {icon:ctx+'images/map/ic_pin_bicycleroad', type:'.png'};
	this.Blist_C = {icon:this.Blist.icon, type:'_c.png'}
	
	this.Plist   = {icon:ctx+'images/map/icon_permit', type:'.png'};
	this.Ilist   = {icon:ctx+'images/map/icon_illegality', type:'.png'};
	
	this.MEMO   = {icon:ctx+'images/map/icon_memo_small', type:'.png'};
	
	this.PIPE   = {icon:ctx+'images/map/icon_fac_pipe', type:'.png'};
	this.GATE   = {icon:ctx+'images/map/icon_fac_gate', type:'.png'};
}


 
var _KrimaLayer = function() {

	// private functions & variables
	var TAG = '[KRIMA LAYER]';
	var format = 'image/png';
	var krimaBaseUrl = '/geoserver/Krima/wms';
	var krimaWFSUrl = '/geoserver/Krima/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Krima:C162&maxFeatures=500&outputFormat=application%2Fjson&CQL_FILTER=';
	var vectorSource;
	
	var style = new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(255, 255, 255, 0.6)'
		}),
		stroke: new ol.style.Stroke({
			color: '#319FD3',
			width: 1
		}),
		text: new ol.style.Text({
			font: '12px Calibri,sans-serif',
		    fill: new ol.style.Fill({
		    	color: '#000'
		    }),
		    stroke: new ol.style.Stroke({
		    	color: '#fff',
		    	width: 3
		    })
		})
	});
	var styles = [style];
	
	var createTileLayer = function(layerInfos) {
		var layers = [];
		
		for(var i=0; i<layerInfos.length; i++){
			var layer = new ol.layer.Tile({
      			visible: layerInfos[i].isVisible,
      			source: new ol.source.TileWMS({
      				url: Common.geoServerUrl+krimaBaseUrl,
      				params: {'FORMAT': format, 
	      				'VERSION': '1.1.0',
	      				tiled: layerInfos[i].isTiled,
	      				LAYERS: 'Krima:'+layerInfos[i].layerNm,
	      				CQL_FILTER:layerInfos[i].cql
	      				},
      				serverType:'geoserver',
      				crossOrigin: 'anonymous'
      			})
			});
			if(layer != null){
				layer.set('layerNm', layerInfos[i].layerNm);
				layers.push(layer);
			}
		}
		return layers;
	};
	var getTbC162Features = function(fnm, mgrcd, callback){
		var formatter = new ol.format.GeoJSON();		
		var vector = new ol.layer.Vector({
			source: new ol.source.Vector({
				loader: function(extent, resolution, projection) {
				    $.getJSON(Common.geoServerUrl+krimaWFSUrl+fnm+mgrcd, function(result){
				    	callback.apply(this, [formatter.readFeatures(result)]);
				    });
				}
			}),
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(0, 255, 255, 0.0)',
			    	width: 1
			    }),
    			fill: new ol.style.Fill({
    				color: 'rgba(255,255,0,0.0)'
    			})
			})
		});
		return vector;
	}
	 
	var loadFeatures = function(response) {
		var geojsonFormat = new ol.format.GeoJSON();
		vectorSource.addFeatures(geojsonFormat.readFeatures(response));
	};
	
	
	var createPointFeatures = function(data, TAG, simbol, isGeometry, isInsp) {

		if(data == null)
			return [];
		
		var featureList = [];
		
		for(var i=0; i<data.length; i++){
			
			var item = data[i];
			item.TAG = TAG;
			
			var suffix = '';
			if(item.fileCnt != null)
				suffix = item.fileCnt > 0 ? '_C':'';
				
			var iconItem;
			if(simbol == null){iconItem = _SimbolRes[item.sisulCd+suffix];}
			else {iconItem = _SimbolRes[simbol+suffix];}
			
			if(iconItem == null){
				iconItem =  _SimbolRes['PIN'];
			}
			
			var geoCoord; 
			if(isInsp){
				item.keyNm = 'facName';
				geoCoord = item.wkt.substring((item.wkt.indexOf('(')+1), item.wkt.indexOf(')')).split(' ');
			}else{
				if(isGeometry){
					geoCoord = JSON.parse(item.shape).coordinates;
					if(geoCoord[0] < 13000000 && geoCoord[1] > 13000000){
						var tmp = geoCoord[0];
						geoCoord[0] = geoCoord[1];
						geoCoord[1] = tmp;
					}
				}else{
					var x = item.xCoord;
					var y = item.yCoord;
					
					if(x == null)
						x = parseFloat(item.x_coord);
					else
						x = parseFloat(x);
					if(y == null)
						y = parseFloat(item.y_coord);
					else
						y = parseFloat(y);
					
					var tmp;
					if(x < 110 && y > 40){
						tmp = x;
						x = y;
						y = tmp;
					}
					geoCoord = _TemplateMap.convertLonLatCoord([x,y], true);
				}
			}
			
			var f = new ol.Feature({
				  geometry: new ol.geom.Point(geoCoord),
				  item: item,
				  name: item.sisulNm
			});
            
			if(isInsp){
				f.setStyle(new ol.style.Style({
					image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
						opacity: 1.0,
						src: iconItem.icon+'1'+iconItem.type
					}))
				}));
			}else{
				f.setStyle(new ol.style.Style({
					image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
						anchor: [0.5, 46],
						anchorXUnits: 'fraction',
						anchorYUnits: 'pixels',
						opacity: 1.0,
						src: iconItem.icon+'1'+iconItem.type
					}))
				}));
			}
			
			
			featureList.push(f);
		}
		return featureList;
	};
	
	// 측단면 
	var createCSMFeature = function(data, TAG) {

		if(data == null)
			return;
		
		var featureList = [];
		
		for(var i=0; i<data.length; i++){
			var item = data[i];
			if(item == null)
				continue;
			item.TAG = TAG;
			
			var f = new ol.Feature({
				  geometry: new ol.geom.LineString(item[1]),
				  item: item,
				  name: 'No.'+item[0]
			});
                
			f.setStyle(new ol.style.Style({
		          stroke: new ol.style.Stroke({
		              color: '#ff0',
		              width: 2
		            }),
		            text: new ol.style.Text({
		                text: f.get('name'),
		                offsetX: 10,
		                offsetY: 10
		              })
		          }));
			
			featureList.push(f);
		}
		return featureList;
	};
	// 라인 
	var createLineFeatures = function(data, TAG, lineColor, isInsp) {

		if(data == null)
			return [];
		
		var featureList = [];
		
		for(var i=0; i<data.length; i++){
			var item = data[i];
			item.TAG = TAG;
			var mgrNm = item.mngNm;
			var coords;
			var type = 'LINESTRING';
			
			if(isInsp) {
				if(item.keyNm == null)
					item.keyNm = 'facName';
				
				coords = [];
				type = item.wkt.substring(0, item.wkt.indexOf('('));
				if(type.indexOf('MULTI')>-1){
					var src = item.wkt.substring((item.wkt.indexOf('((')+2), item.wkt.indexOf('))')).split('),(');	
					for(var j=0;j<src.length; j++){
						if(coords[j] == null)
							coords[j] = [];
						var linePoints = src[j].split(',');
						for(var z=0; z<linePoints.length; z++){
							var coord = linePoints[z].split(' ');
							if(coords[j][z] == null)
								coords[j][z] = [];
							coords[j][z][0] = parseFloat(coord[0]);
							coords[j][z][1] = parseFloat(coord[1]);	
						}
					}
				}else{
					var src = item.wkt.substring((item.wkt.indexOf('(')+1), item.wkt.indexOf(')')).split(',');	
					for(var j=0;j<src.length; j++){
						coords[j]= src[j].split(' ');
						coords[j][0] = parseFloat(coords[j][0]);
						coords[j][1] = parseFloat(coords[j][1]);
					}
				}
			}else{
				coords = JSON.parse(item.shape).coordinates;
			}
			
			var geometry;
			if(type == 'LINESTRING'){
				geometry = new ol.geom.LineString(coords);
			}else{
				geometry = new ol.geom.MultiLineString(coords);	
			}
			
			var f = new ol.Feature({
				  geometry: geometry,
				  item: item
			});
			if(mgrNm == null){
				
			} else if(mgrNm == "국토교통부" ){
				lineColor = '#00ff00';
			} else if (mgrNm =="지자체"){
				lineColor = '#0000ff';
			} else if (mgrNm == "수자원공사"){
				lineColor = '#ff00ff';
			}
			
			f.setStyle(new ol.style.Style({
		          stroke: new ol.style.Stroke({
		              color: lineColor,
		              width: 2
		            })
		          }));
			
			featureList.push(f);
		}
		return featureList;
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
		loadFeatures:function(response){
			loadFeatures(response);
		},
		createPointFeatures: function(data, TAG, simbol, isGeo, isInsp){
			return createPointFeatures(data, TAG, simbol, isGeo, isInsp);
		},
		createCSMFeature: function(data, TAG){
			return createCSMFeature(data, TAG);
		},
		createLineFeatures: function(data, TAG, lineColor, isInsp){
			return createLineFeatures(data, TAG, lineColor, isInsp);
		},
		createPolygonFeatures: function(data, TAG, lineColor, fillColor, isInsp){
			return createPolygonFeatures(data, TAG, lineColor, fillColor, isInsp);
		},
		getTbC162Features: function(fnm, mgrcd, callback){
			return getTbC162Features(fnm, mgrcd, callback);
		}
	};

}();
