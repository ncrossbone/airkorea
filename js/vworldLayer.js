var _VWorldLayer = function () {
    // private functions & variables
	var vworldVers = {
		Base : '201512',
		Hybrid : '201512',
		Satellite : '201301',
		Gray : '201512',
		Midnight : '201512'
	};
	
	var vworldBaseUrl = 'http://xdworld.vworld.kr:8080/2d';
	var vwBaseMapUrl = vworldBaseUrl+'/Base/'+vworldVers.Base+'/{z}/{x}/{y}.png';
	var vwHybridMapUrl = vworldBaseUrl+'/Hybrid/'+vworldVers.Hybrid+'/{z}/{x}/{y}.png';
	var vwRasterMapUrl = vworldBaseUrl+'/Satellite/'+vworldVers.Satellite+'/{z}/{x}/{y}.jpeg';
	
	var vwGrayMapUrl = vworldBaseUrl+'/Gray/'+vworldVers.Base+'/{z}/{x}/{y}.png';
	
	var _bbox = [50119.84,967246.47,2176674.68,12765761.31];
	var tileSizes = 256; 
	
	var initParam = {
		worldProjection:'EPSG:4326',
		targetProjection:'EPSG:3857',
		layerBbox:_bbox,
		resoutions:[2048,1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5],
		center :{
			lon:127.0396037,
			lat: 37.5010226,
			zoom:16
		}
	};
	
	var createVWorldBaseMapLayer = function(options){
		if(options == null){
			options = {isVisible:false,
					name:'Base',
					group:'BaseMap'};
		}
		return new ol.layer.Tile({
			preload: Infinity,
			source: new ol.source.XYZ({ 
				tileSize: tileSizes,
				url:vwGrayMapUrl,
				projection:initParam.targetProjection
			}),
			extend:_bbox,
			name: options.name != null ? options.name:'Base',
			group:options.group != null ? options.group:'BaseMap',
			visible:options.isVisible != null ? options.isVisible:false
		});
	};
	
	var createVWorldHybridMapLayer = function(options){
		if(options == null){
			options = {isVisible:false,
					name:'Hybrid',
					group:'Hybrid'};
		}
		return new ol.layer.Tile({
			source: new ol.source.XYZ({
				tileSize: tileSizes,
				url:vwHybridMapUrl,
				projection:initParam.targetProjection
			}),
			extend:_bbox,
			name: options.name != null ? options.name:'Hybrid',
			group:options.group != null ? options.group:'SatelliteMap',
			visible:options.isVisible != null ? options.isVisible:false
		});
	}
	var createVWorldSatelliteMapLayer = function(options){
		if(options == null){
			options = {isVisible:false,
					name:'Satellite',
					group:'Satellite'};
		}
		return new ol.layer.Tile({
			source: new ol.source.XYZ({
				tileSize: tileSizes,
				url:vwRasterMapUrl,
				projection:initParam.targetProjection
			}),
			extend:_bbox,
			name: options.name != null ? options.name:'Satellite',
			group:options.group != null ? options.group:'SatelliteMap',
			visible:options.isVisible != null ? options.isVisible:false
		});
	}
    // public functions
    return {
    	  
        init: function () {
        	var me = this;
        	return me;
        },
        createVWorldBaseMapLayer:function(options){
        	return createVWorldBaseMapLayer(options);
        },
        createVWorldHybridMapLayer:function(options){
        	return createVWorldHybridMapLayer(options);
        },
        createVWorldSatelliteMapLayer:function(options){
        	return createVWorldSatelliteMapLayer(options);
        }
    }; 
  
}();
