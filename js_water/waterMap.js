dojo.require("esri.map");
dojo.require("esri.layers.WebTiledLayer");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.InfoTemplate");
dojo.require("esri.geometry.Point");

dojo.require("dojo.domReady!");

var $waterMap = function() {
	// private functions & variables
	var ARC_SERVER_URL = "http://112.217.167.123:20002/arcgis"
	var WKT = 3857;
	var MAP_SPATIALREFERENCE = null; // 4326;
	
	var ORIGIN = {
					"x": 13462700,
					"y": 5322463
				};
	var TILEINFO = null;
	
	var map;
	var vworldLayer;
	var vworldHybridLayer;
	var vworldSatelliteLayer;
	var areaFeatureLayer;
	
	var init = function(){
		
		TILEINFO = new esri.layers.TileInfo({
			"rows": 256,
			"cols": 256,
			"origin": ORIGIN,
			"spatialReference": {
				"wkt": WKT
			},
			"lods": [
						{ "level": 0,  "resolution": 1222.99245256249,   "scale": 4622324.434309 },
						{ "level": 1,  "resolution": 611.49622628138,    "scale": 2311162.217155 },
						{ "level": 2,  "resolution": 305.748113140558,   "scale": 1155581.108577 },
						{ "level": 3,  "resolution": 152.874056570411,   "scale": 577790.554289 },
						{ "level": 4,  "resolution": 76.4370282850732,   "scale": 288895.277144 },
						{ "level": 5,  "resolution": 38.2185141425366,   "scale": 144447.638572 },
						{ "level": 6,  "resolution": 19.1092570712683,   "scale": 72223.819286 },
						{ "level": 7,  "resolution": 9.55462853563415,   "scale": 36111.909643 },
						{ "level": 8,  "resolution": 4.77731426794937,   "scale": 18055.954822 },
						{ "level": 9,  "resolution": 2.38865713397468,   "scale": 9027.977411 },
						{ "level": 10, "resolution": 1.19432856685505,   "scale": 4513.988705 },
						{ "level": 11, "resolution": 0.597164283559817,  "scale": 2256.994353 }
						]
		});
		initVWorldBaseLayer();
		initVWorldSatelliteLayer();
		initVWorldHybridLayer();
		
		var spatialReference = new esri.SpatialReference(WKT);
			
		var initialExtent = new esri.geometry.Extent({
				xmax:14381785.062839303,
				xmin:14290060.628897216,
				ymax:4322831.032734754,
				ymin:4261681.410106694,
				spatialReference:spatialReference
		});
		
		map = new esri.Map("map",{
				sliderPosition:'top-right',
				slider: false,
				logo: false,
				sliderStyle: "large",
				Extent:initialExtent,
				center: new esri.geometry.Point(14340738.378650252, 4293326.339816739, spatialReference),
				zoom: 4});
		
		
		vworldLayer = new VworldTiledMapServiceLayer();
		map.addLayer(vworldLayer);
		
		vworldSatelliteLayer = new VworldTiledSatelliteMapServiceLayer();
		map.addLayer(vworldSatelliteLayer);
		vworldSatelliteLayer.hide();
		
		vworldHybridLayer = new VworldTiledHybridMapServiceLayer();
		map.addLayer(vworldHybridLayer);
		vworldHybridLayer.hide();
		
		
		setTimeout(function(){
			map.setExtent(new esri.geometry.Extent({"type":"extent","xmin":14306574.321405722,"ymin":4277871.868975288,"xmax":14329505.429891245,"ymax":4293159.274632302,"spatialReference":{"wkid":3857}}));
		}, 1000);
		var infoTemplate = new esri.InfoTemplate("${PL_ID}", "VAL :   ${VAL}");
		
		var symbol = new esri.symbol.SimpleFillSymbol();
		symbol.setColor(new esri.Color([150, 150, 150, 0.5]));
		var outlineSymbol =  new esri.symbol.SimpleLineSymbol().setWidth(0);
		
		var renderer = new esri.renderer.ClassBreaksRenderer(symbol, "VAL");
		renderer.addBreak(18, 21, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, outlineSymbol,new esri.Color([214,214,255, 0.9])));
		renderer.addBreak(16, 18, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,  new esri.Color([182,185,242, 0.9])));
		renderer.addBreak(14, 16, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,  new esri.Color([151,159,230, 0.9])));
		renderer.addBreak(12, 14, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,  new esri.Color([121,134,217, 0.9])));
		renderer.addBreak(10, 12, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol, new esri.Color([97,117,207, 0.9])));
		renderer.addBreak(8,  10, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([74,100,194, 0.9])));
		renderer.addBreak(6,  8, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([51,85,181,  0.9])));
		renderer.addBreak(4,  6, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([32,74,171, 0.9])));
		renderer.addBreak(2,  4, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([16,66,158, 0.9])));
		renderer.addBreak(0,  2, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([0,57,148, 0.9])));
		
		renderer.addBreak(232, 238, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([255,224,224, 0.9])));
		renderer.addBreak(228, 232, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([245,196,191, 0.9])));
		renderer.addBreak(225, 228, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([237,173,164, 0.9])));
		renderer.addBreak(221, 225, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([224,146,132, 0.9])));
		renderer.addBreak(218, 221, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([214,125,109, 0.9])));
		renderer.addBreak(214, 218, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([201,102,85, 0.9])));
		renderer.addBreak(211, 214, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([186,78,61, 0.9])));
		renderer.addBreak(207, 211, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([173,59,43, 0.9])));
		renderer.addBreak(204, 207, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([158,36,25, 0.9])));
		renderer.addBreak(200, 204, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([143,10,10, 0.9])));
		
		renderer.addBreak(100, 110, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([56,168,0, 0.9])));
		renderer.addBreak(110, 119, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([90,186,0, 0.9])));
		renderer.addBreak(119, 129, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([131,207,0, 0.9])));
		renderer.addBreak(129, 138, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([176,224,0, 0.9])));
		renderer.addBreak(138, 148, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([228,245,0, 0.9])));
		renderer.addBreak(148, 157, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([255,225,0, 0.9])));
		renderer.addBreak(157, 166, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([255,170,0, 0.9])));
		renderer.addBreak(166, 176, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([255,115,0, 0.9])));
		renderer.addBreak(176, 185, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([255,55,0, 0.9])));
		renderer.addBreak(185, 199, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([255,0,0, 0.9])));
		
		
		renderer.addBreak(1, 5000, new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,outlineSymbol,new esri.Color([255,0,0, 0.9])));
		
		map.on('extent-change', function(info){
			
			if(areaFeatureLayer != null){
				map.removeLayer(areaFeatureLayer);	
			}
			
			var query = new esri.tasks.Query();
			query.geometry = info.extent;
			query.outFields = ['OBJECTID_1','PL_ID', 'PL_SUM', 'UP_OBS_ID', 'DN_OBS_ID'];
			query.returnGeometry  = true;
			query.outSpatialReference = spatialReference;
			
			var queryTask2 = new esri.tasks.QueryTask(ARC_SERVER_URL+'/rest/services/observe_PT/MapServer/5');			
//			var queryTask3 = new esri.tasks.QueryTask(ARC_SERVER_URL+'/rest/services/observe_PT/MapServer/3');
//			var queryTask4 = new esri.tasks.QueryTask(ARC_SERVER_URL+'/rest/services/observe_PT/MapServer/4');
			
			queryTask2.on("error", function(error){
				console.log('error', error);
			});
//			queryTask3.on("error", function(error){
//				console.log('error', error);
//			});
//			queryTask4.on("error", function(error){
//				console.log('error', error);
//			});
			var queryTask2Def = queryTask2.execute(query);
//			var queryTask3Def = queryTask3.execute(query);
//			var queryTask4Def = queryTask4.execute(query);
			
			
			var deferredlist = new dojo.DeferredList([queryTask2Def]); // ,queryTask3Def,queryTask4Def
			
			deferredlist.then(function(result){
				var features = [];
				for(var i=0; i<result.length; i++){
					if(result[i][0]){
						for(var j=0; j<result[i][1].features.length; j++){
							var feature =  result[i][1].features[j];
							feature.attributes.VAL = measureToValue(feature.attributes);
							features.push(feature);
						}
					}
				}
				var fields = [];
				fields.push({"name":"OBJECTID_1", "type":"esriFieldTypeOID", "alias":"OBJECTID_1"});
//				fields.push({"name":"PL_ID", "type":"esriFieldTypeDouble", "alias":"PL_ID"});
				fields.push({"name":"VAL", "type":"esriFieldTypeInteger", "alias":"VALUE"});
				
				var featureCollection = {
						featureSet: {"geometryType":"esriGeometryPolygon", "features":features},
						layerDefinition: {"geometryType":"esriGeometryPolygon","fields":fields}
						};

				console.log(featureCollection)
				areaFeatureLayer = new esri.layers.FeatureLayer(featureCollection,{
		            id:'areaFeatureLayer',
		            infoTemplate: infoTemplate
		        });
				areaFeatureLayer.setRenderer(renderer);
				
				map.addLayer(areaFeatureLayer);
				
			});
		});
	}
	
	var measureToValue = function(attr){
		if(attr.UP_OBS_ID == '0000000' || attr.UP_OBS_ID.indexOf('N') > -1){
			return 20;
		}
		if(attr.DN_OBS_ID == '0000000' || attr.DN_OBS_ID.indexOf('N') > -1){
			return 101;
		}
		
		return 100+Math.round(attr.PL_ID/attr.PL_SUM* 100); 
	}
	
	var initVWorldBaseLayer = function () {
		dojo.declare("VworldTiledMapServiceLayer", esri.layers.TiledMapServiceLayer,{
			constructor: function () {
				this.id = "BaseMap";
				this.spatialReference = new esri.SpatialReference(WKT);
				this.initialExtent = (this.fullExtent = new esri.geometry.Extent(13417793.028, 3777430.348, 15084515.335, 4772379.684, this.spatialReference));
				var lod = [];
				this.tileInfo = TILEINFO;
				this.loaded = true;
				this.onLoad(this);
			},
			getTileUrl: function (level, row, col) {
				var newrow = row + (Math.pow(2, level) * 47);
				var newcol = col + (Math.pow(2, level) * 107);
				var returnUrl = "http://xdworld.vworld.kr:8080/2d/Base/201612/" + (level + 7) + "/" + newcol + "/" + newrow + ".png";
				return returnUrl;
			}
		});
	};
	
	// 브이월드 위성맵 세팅
	var initVWorldSatelliteLayer = function () {
		dojo.declare("VworldTiledSatelliteMapServiceLayer", esri.layers.TiledMapServiceLayer, 
		{
			constructor: function () {
				this.id = "SatelliteMap";
				this.spatialReference = new esri.SpatialReference(WKT);
				this.initialExtent = (this.fullExtent = new esri.geometry.Extent(13417793.028, 3777430.348, 15084515.335, 4772379.684, this.spatialReference));
				var lod = [];

				this.tileInfo = TILEINFO;

				this.loaded = true;
				this.onLoad(this);
			},
			
			getTileUrl: function (level, row, col) {
				
				var newrow = row + (Math.pow(2, level) * 47);
				var newcol = col + (Math.pow(2, level) * 107);
				var returnUrl = "http://xdworld.vworld.kr:8080/2d/Satellite/201301/" + (level + 7) + "/" + newcol + "/" + newrow + ".jpeg";
				return returnUrl;
			}
		});
	};
	
	// 브이 월드 중첩맵 세팅
	var initVWorldHybridLayer = function () {
		dojo.declare("VworldTiledHybridMapServiceLayer", esri.layers.TiledMapServiceLayer,{
			constructor: function () {
				this.id = "HybridMap";
				this.spatialReference = new esri.SpatialReference(WKT);
				this.initialExtent = (this.fullExtent = new esri.geometry.Extent(13417793.028, 3777430.348, 15084515.335, 4772379.684, this.spatialReference));
				var lod = [];

				this.tileInfo = TILEINFO;

				this.loaded = true;
				this.onLoad(this);
			},
			
			getTileUrl: function (level, row, col) {
				
				var newrow = row + (Math.pow(2, level) * 47);
				var newcol = col + (Math.pow(2, level) * 107);
				var returnUrl = "http://xdworld.vworld.kr:8080/2d/Hybrid/201512/" + (level + 7) + "/" + newcol + "/" + newrow + ".png";
				return returnUrl;
			}
		});
	};
	
	// public functions
	return {

		init : function() {
			var me = this;

			init();

			return me;
		},
		getMap : function(){
			return map;
		}
	};

}();
