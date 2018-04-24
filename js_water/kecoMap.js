dojo.require("esri.map");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("esri.virtualearth.VETiledLayer");
dojo.require("dijit.TitlePane");
dojo.require("esri.dijit.BasemapGallery");
dojo.require("esri.arcgis.utils");
dojo.require("esri.tasks.query");
dojo.require("esri.tasks.geometry");
dojo.require("esri.layers.WebTiledLayer");
dojo.require("esri.dijit.Measurement");
dojo.require("esri.renderers.SimpleRenderer");
dojo.require("esri.symbols.SimpleFillSymbol");
dojo.require("esri.dijit.Scalebar");
dojo.require("dojo.parser");
dojo.require("esri.dijit.Legend");
dojo.require("dojo._base.array");
dojo.require("esri.layers.LayerInfo");
dojo.require("esri.layers.ImageParameters");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.domReady!");
dojo.require("esri.geometry.Point");
dojo.require("esri.dijit.OverviewMap");
dojo.require("esri.toolbars.edit");
dojo.require("esri.symbols.SimpleFillSymbol");
dojo.require("esri.renderers.UniqueValueRenderer");
dojo.require("esri.dijit.InfoWindow");
dojo.require("esri.tasks.IdentifyTask");
dojo.require("esri.tasks.IdentifyParameters");

var $kecoMap;
$(function() {
	
	var page = {
		"dom" : $(this)
	};
	
	var TAG = page.id;
	var WKT = 3857;
	var MAP_SPATIALREFERENCE = null; // 4326;
	
	var ORIGIN = {
					"x": 13462700,
					"y": 5322463
				};
	var TILEINFO = null; 
	
	var TEMPLATJSON  = {
			title:"${OBJECTID}",
			content: "${*}"};
		
	var EVENT_TEMP  = {
			title:"${wpkind}",
			content: "<ul>"
						+ "<li> ● 사고유형 : ${wpkind} </li>"
						+ "<li> ● 신고일자 : ${reportdate}</li>"
						+ "<li> ● 접수일자 : ${receivedate}</li>"
						+ "<li> ● 수계 : ${river_name} </li>"
						+ "<li> ● 주소 : ${address} ${addrdet}</li>"
						+ "<li> ● 처리상태 : ${supportkind}</li></ul>"
					};
	var TEMPLATJSON  = {
			title:"${사업장명칭}",
			content: "<ul>"
						+ "<li> ● 수신시간 : ${date} ${time} </li>"
						+ "<li> ● PH : ${ph}</li>"
						+ "<li> ● DO : ${DO1} (ms/L)</li>"
						+ "<li> ● EC : ${EC1} (mS/w)</li>"
						+ "<li> ● 탁도 : ${NTU}</li>"
						+ "<li> ● 온도 : ${heat}</li></ul>"
					};
	var TMS_TEMP  = {
			title:"${FACTNAME}",
			content: "<ul>"
						+ "<li> ● 수신시간 : ${STRDATE} ${STRTIME} </li>"
						+ "<li> ● 권역 : ${RIVER_NAME} </li>"
						+ "<li> ● PH : ${PHY}</li>"
						+ "<li> ● BOD : ${BOD} (ppm)</li>"
						+ "<li> ● COD : ${COD} (ppm)</li>"
						+ "<li> ● SS : ${SUS} (mg/L)</li>"
						+ "<li> ● T-N : ${TON} (mg/L)</li>"
						+ "<li> ● T-P : ${TOP} (mg/L)</li>"
						+ "<li> ● 유량 : ${FLW} (㎥/hr)</li></ul>"
					};
	var IPUSN_TEMP = {
			title:"${FACTNAME}"+"("+"${BRANCH_NAME}"+")",
			content: "<ul>"
						+ "<li> ● 수신시간 : ${STRDATE} ${STRTIME} </li>"
						+ "<li> ● 수계 : ${RIVER_NAME} </li>"
						+ "<li> ● PH : ${PHY}</li>"
						+ "<li> ● DO : ${DOW} (mS/cm)</li>"
						+ "<li> ● EC : ${CON} (mS/cm)</li>"
						+ "<li> ● 탁도 : ${TUR} (NTU)</li>"
						+ "<li> ● 수온 : ${TMP} (℃)</li></ul>"
					};
	var IPUSN_TEMP_ALERT = {
			title:"${BRANCH_NAME}",
			content: "<ul>"
						+ "<li> ● 수신시간 : ${STRDATE} ${STRTIME} </li>"
						+ "<li> ● 수계 : ${RIVER_NAME} </li>"
						+ "<li> ● PH : ${PHY} </li>"
						+ "<li> ● DO : ${DOW} (mS/cm)</li>"
						+ "<li> ● EC : ${CON} (mS/cm)</li>"
						+ "<li> ● 탁도 : ${TUR} (NTU)</li>"
						+ "<li> ● 수온 : ${TMP} (℃)</li></ul>"
						+ "<li><font color=\"#ff0000\"> ● 이상메세지 : ${ALERT_MSG}</font></li></ul>"
					};
	var IPUSN_TEMP_THEME = {
			title:"${FACTNAME}",
			content: "<ul>"
						+ "<li> ● 수신시간 : ${STRDATE} ${STRTIME} </li>"
						+ "<li> ● 수계 : ${RIVER_NAME} </li>"
						+ "<li> ● PH : ${PHY} </li>"
						+ "<li> ● DO : ${DOW} (mS/cm)</li>"
						+ "<li> ● EC : ${CON} (mS/cm)</li>"
						+ "<li> ● 탁도 : ${TUR} (NTU)</li>"
						+ "<li> ● 수온 : ${TMP} (℃)</li>"
						+ "<li> ● 기준치 알람 : ${ALAM}</li></ul>"
					};
	var AUTO_TEMP = {
			title:"${FACTNAME}",
			content: "<ul>"
						+ "<li> ● 수신시간 : ${STRDATE} ${STRTIME} </li>"
						+ "<li> ● 수계 : ${RIVER_NAME} </li>"
						+ "<li> ● PH : ${PHY} </li>"
						+ "<li> ● DO : ${DOW} (mS/cm)</li>"
// + "<li> ● EC : ${CON} (mS/cm)</li>"
						+ "<li> ● EC : ${CON} (μS/cm)</li>"
						+ "<li> ● 탁도 : ${TUR} (NTU)</li>"
						+ "<li> ● 수온 : ${TMP} (℃)</li></ul>"
						};
	var AUTO_TEMP_ALERT = {
			title:"${FACTNAME}",
			content: "<ul>"
						+ "<li> ● 수신시간 : ${STRDATE} ${STRTIME} </li>"
						+ "<li> ● 수계 : ${RIVER_NAME} </li>"
						+ "<li> ● PH : ${PHY} </li>"
						+ "<li> ● DO : ${DOW} (mS/cm)</li>"
						+ "<li> ● EC : ${CON} (μS/cm)</li>"
// + "<li> ● EC : ${CON} (mS/cm)</li>"
						+ "<li> ● 탁도 : ${TUR} (NTU)</li>"
						+ "<li> ● 수온 : ${TMP} (℃)</li></ul>"
						+ "<li><font color=\"#ff0000\"> ● 이상메세지 : ${ALERT_MSG}</font></li></ul>"
					};
	var AUTO_TEMP_THEME = {
			title:"${FACTNAME}",
			content: "<ul>"
						+ "<li> ● 수신시간 : ${STRDATE} ${STRTIME} </li>"
						+ "<li> ● 수계 : ${RIVER_NAME} </li>"
						+ "<li> ● PH : ${PHY} </li>"
						+ "<li> ● DO : ${DOW} (mS/cm)</li>"
// + "<li> ● EC : ${CON} (mS/cm)</li>"
						+ "<li> ● EC : ${CON} (μS/cm)</li>"
						+ "<li> ● 탁도 : ${TUR} (NTU)</li>"
						+ "<li> ● 수온 : ${TMP} (℃)</li>"
						+ "<li> ● 기준치 알람 : ${ALAM}</li></ul>"
					};
	var NULL_TEMP = {
			title:"${FACI_NM}",
			content: "<ul>"
						+ "<li> 정보가 없습니다. </li></ul>"
					};
	var OUT_TEMP = {
			title:"${branch_name}",
			content: "<ul>"
						+ "<li> ● 수신시간 : ${update_time} </li>"
						+ "<li> ● 코드 : ${fact_code} </li>"
						+ "<li> ● 배터리 : ${battery} </li>"
						+ "<li> ● 위도 : ${latitude} </li>"
						+ "<li> ● 경도 : ${longitude} </li></ul>"
					};
	var TEMP_B_TEMP = {
			title:"${TITLE}",
			content: "<ul>"
						+ "<li> ● 등록자 : ${REG_ID} </li>"
						+ "<li> ● 등록일자 : ${REG_DATE} </li>"
						+ "<li> ● 상세정보 : ${CONTENT} </li>"
					};
	var CR_TEMP  = {
			title:"${branch_name}",
			content: "<ul>"
						+ "<li> ● 수신시간 : ${update_time} </li>"
						+ "<li> ● 코드 : ${fact_code} </li>"
						+ "<li> ● 배터리 : ${battery} </li>"
						+ "<li> ● 위도 : ${latitude} </li>"
						+ "<li> ● 경도 : ${longitude} </li></ul>"
					};
	var TEMP_DE = {};
	TEMP_DE['de4'] = {
			title:"${보명}",
			content: "<ul>"
						+ "<li> ● 관측소명 : ${보명} </li>"
						+ "<li> ● 수계 : ${수계} </li></ul>"
					};
	TEMP_DE['de5'] = {
			title:"${관측소명}",
			content: "<ul>"
						+ "<li> ● 관측소명 : ${관측소명} </li>"
						+ "<li> ● 관측소코드 : ${관측소코드} </li>"
						+ "<li> ● 댐종류 : ${댐종류} </li>"
						+ "<li> ● 법정동코드 : ${법정동코드} </li>"
						+ "<li> ● 관할기관 : ${관할기관} </li>"
						+ "<li> ● 주소 : ${주소} </li></ul>"
					};
	TEMP_DE['de6'] = {
			title:"${취수장명}",
			content: "<ul>"
						+ "<li> ● 취수장명 : ${취수장명} </li>"
						+ "<li> ● 주소 : ${주소} </li>"
						+ "<li> ● 대책수계 : ${대책수계} </li>"
						+ "<li> ● 대책권역 : ${대책권역} </li>"
						+ "<li> ● 대책유역 : ${대책유역} </li>"
						+ "<li> ● 시설용량 : ${시설용량} </li>"
						+ "<li> ● 수원_표류 : ${수원_표류} </li>"
						+ "<li> ● 수원_복류 : ${수원_복류} </li>"
						+ "<li> ● 수원_댐 : ${수원_댐} </li>"
						+ "<li> ● 수원_기타 : ${수원_기타} </li>"
						+ "<li> ● 수원_지하 : ${수원_지하} </li>"
						+ "<li> ● 일평균취수 : ${일평균취수} </li>"
						+ "<li> ● 공급량 : ${공급량} </li>"
						+ "<li> ● 수원_복류 : ${수원_복류} </li>"
						+ "<li> ● 정수장 : ${정수장} </li>"
						+ "<li> ● 비고 : ${비고} </li>"
						+ "<li> ● 조인여부 : ${조인여부} </li></ul>"
					};
	TEMP_DE['de7'] = {
			title:"${정수장명}",
			content: "<ul>"
						+ "<li> ● 정수장명 : ${정수장명} </li>"
						+ "<li> ● 배수코드 : ${배수코드} </li>"
						+ "<li> ● 배수구역 : ${배수구역} </li>"
						+ "<li> ● 대책수계 : ${대책수계} </li>"
						+ "<li> ● 대책권역 : ${대책권역} </li>"
						+ "<li> ● 대책유역 : ${대책유역} </li>"
						+ "<li> ● 시설용량 : ${시설용량} </li>"
						+ "<li> ● 간이처리 : ${간이처리} </li>"
						+ "<li> ● 완속여과 : ${완속여과} </li>"
						+ "<li> ● 급속여과 : ${급속여과} </li>"
						+ "<li> ● 고도처리 : ${고도처리} </li>"
						+ "<li> ● 일최대급수 : ${일최대급수} </li>"
						+ "<li> ● 일평균급수 : ${일평균급수} </li>"
						+ "<li> ● 급수구역 : ${급수구역} </li>"
						+ "<li> ● 급수인구 : ${급수인구} </li>"
						+ "<li> ● 정수장 : ${정수장} </li>"
						+ "<li> ● 비고 : ${비고} </li>"
						+ "<li> ● 주소 : ${주소} </li></ul>"
					};
	TEMP_DE['de8'] = {
			title:"${NAME}",
			content: "<ul>"
						+ "<li> ● 댐명 : ${NAME} </li>"
						+ "<li> ● 주소 : ${ADDRESS} </li>"
						+ "<li> ● 수계 : ${RIVER_NM} </li>"
						+ "<li> ● 관리과 : ${NGI_MANAGE} </li>"
						+ "<li> ● 대책권역 : ${NGI_MANAGE} </li></ul>"
					};
	// //////////////////
	TEMP_DE['de9'] = {
			title:"${OBSNM}",
			content: "<ul>"
						+ "<li> ● 보명 : ${OBSNM} </li></ul>"
					};// ////////
	// MVC 설정 시작
	// ////////////////////////////
	
	// TODO MVC::model 관련 코드 작성
	page.model = ( function() {
		// ////////////////////////////
		// private variables
		// ////////////////////////////
		// Model 초기화
		
		var pub = {};
		// 브이 월드 맵 세팅
		pub.initVWorldBaseLayer = function () {
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
		pub.initVWorldSatelliteLayer = function () {
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
		pub.initVWorldHybridLayer = function () {
			dojo.declare("VworldTiledHybridMapServiceLayer", esri.layers.TiledMapServiceLayer, 
			{
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
		
		pub.init = function() {
			TILEINFO = new esri.layers.TileInfo({
				"rows": 256,
				"cols": 256,
				"origin": ORIGIN,
				"spatialReference": {
					"wkt": WKT
				},
				"lods": [
							{ "level": 0, "resolution": 1222.99245256249, "scale": 4622324.434309 },
							{ "level": 1, "resolution": 611.49622628138, "scale": 2311162.217155 },
							{ "level": 2, "resolution": 305.748113140558, "scale": 1155581.108577 },
							{ "level": 3, "resolution": 152.874056570411, "scale": 577790.554289 },
							{ "level": 4, "resolution": 76.4370282850732, "scale": 288895.277144 },
							{ "level": 5, "resolution": 38.2185141425366, "scale": 144447.638572 },
							{ "level": 6, "resolution": 19.1092570712683, "scale": 72223.819286 },
							{ "level": 7, "resolution": 9.55462853563415, "scale": 36111.909643 },
							{ "level": 8, "resolution": 4.77731426794937, "scale": 18055.954822 },
							{ "level": 9, "resolution": 2.38865713397468, "scale": 9027.977411 },
							{ "level": 10, "resolution": 1.19432856685505, "scale": 4513.988705 },
							{ "level": 11, "resolution": 0.597164283559817, "scale": 2256.994353 }
							]
			});
			
			this.initVWorldBaseLayer();
			this.initVWorldSatelliteLayer();
			this.initVWorldHybridLayer();
			
			var spatialReference = new esri.SpatialReference(WKT);
				
			var initialExtent = new esri.geometry.Extent({ "xmin": 13517793.028, "ymin": 3877430.348, "xmax": 15084515.335, "ymax": 4672379.684, "spatialReference": spatialReference });
			
			var initCenter = esri.geometry.geographicToWebMercator(new esri.geometry.Point('127.81560','36.813077'));
			
			page.view.map = new esri.Map("map",{
					sliderPosition:'top-right',
					slider: false,
					logo: false,
					sliderStyle: "large",
					Extent:initialExtent,
					center : initCenter,
					infoWindow: infoWindow,
					zoom: 1});
			
			dojo.connect(page.view.map, "onZoomEnd" , $kecoMap.controller.zoomEnd);
			dojo.connect(page.view.map, "onLoad" , $kecoMap.controller.initDraw);
			
			page.view.vworldLayer = new VworldTiledMapServiceLayer();
			page.view.map.addLayer(page.view.vworldLayer);
			
			page.view.vworldSatelliteLayer = new VworldTiledSatelliteMapServiceLayer();
			page.view.map.addLayer(page.view.vworldSatelliteLayer);
			page.view.vworldSatelliteLayer.hide();
			
			page.view.vworldHybridLayer = new VworldTiledHybridMapServiceLayer();
			page.view.map.addLayer(page.view.vworldHybridLayer);
			page.view.vworldHybridLayer.hide();
			
			page.view.gsvc = new esri.tasks.GeometryService($define.ARC_SERVER_URL+"/rest/services/Utilities/Geometry/GeometryServer");
		};
		return pub;
	}());

	// TODO MVC::view 관련 코드 작성
	page.view = ( function() {
		// ////////////////////////////
		// private variables
		// ////////////////////////////
		
		// ////////////////////////////
		// private functions
		// ////////////////////////////
		
		// ////////////////////////////
		// public functions
		// ////////////////////////////
		var pub = {};
		
		// View 초기화
		var pub = {};
		pub.map = null;
		
		pub.queryTask = null;
		pub.query = null;
		
		pub.gsvc = null;
		
		pub.vworldLayer = null;
		pub.vworldSatelliteLayer = null;
		pub.vworldHybridLayer = null;
		
		
		// View 초기화
		pub.init = function() {
			
		};
		return pub;
	}());
	
	// TODO MVC::controller 관련 코드 작성
	page.controller = ( function() {
		// ////////////////////////////
		// private variables
		// ////////////////////////////
		
		// ////////////////////////////
		// private functions
		// ////////////////////////////

		// ////////////////////////////
		// public functions
		// ////////////////////////////
		var pub = {};
		
		pub.initDraw = function(){
			dojo.connect(page.view.tb, "onDrawEnd", page.model.drawEnded);
		};
		
		pub.mainLayerLoaded = function(layer){
			console.log('[loaded ] = ', layer);
		};
		
		pub.zoomEnd = function(extent, zoomFactor, anchor ,level) {
			
		};
		// Controller 초기화
		pub.init = function() {
			// Model 과 View 초기화
			page.view.init();
			
			// ///////////////////
			// 이벤트 핸들러 등록
			// ///////////////////
			// console.log('[KEPCO MAP INIT]');
			page.model.init();
			
		};

		return pub;
	}());
	
	dojo.ready(page.controller.init);
	
	$kecoMap = page;
});
