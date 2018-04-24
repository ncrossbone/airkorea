if (ol.Map.prototype.getLayerForName === undefined) {    
    ol.Map.prototype.getLayerForName = function (name) {
        var layer;
        this.getLayers().forEach(function (lyr) {
            if (name == lyr.get('name')) {
                layer = lyr;
            }            
        });
        return layer;
    }
}

var _AirKoreaMap = function() {
	// private functions & variables

	var TAG = '[Air Korea MAP]';
	var vworldAddrUrl = 'http://apis.vworld.kr/coord2jibun.do?x=#X#&y=#Y#&apiKey=7A0635A7-67B9-39CD-96BC-65D901E709B3&domain=http://www.eburin.net&output=json&epsg=EPSG:4326&callback=?';
	var nhnAddrUrl    = 'http://openapi.map.naver.com/api/reversegeocode?key=ed361f09f893f6489eed72ec266fa190&encoding=utf-8&coord=latlng&output=json&callback=?&query=#X#,#Y#';
	
	var DRAG_MODE_NONE = 'NONE';
	
	var templateMap;
	var templateMapLayers = [];
	
	var vworldWmsLayers = [{'group':'1', 'title':'용도지역도','layers':[{'layerNm':'LT_C_UQ111', 'title':'도시지역'},
																      {'layerNm':'LT_C_UQ112', 'title':'관리지역'},
																      {'layerNm':'LT_C_UQ113', 'title':'농림지역'},
																      {'layerNm':'LT_C_UQ114', 'title':'자연환경보전지역'}]},
					       {'group':'2', 'title':'용도지구도','layers':[{'layerNm':'LT_C_UQ121', 'title':'경관지구'},
																      {'layerNm':'LT_C_UQ122', 'title':'미관지구'},
																      {'layerNm':'LT_C_UQ123', 'title':'고도지구'},
																      {'layerNm':'LT_C_UQ124', 'title':'방화지구'},
																      {'layerNm':'LT_C_UQ125', 'title':'방재지구'},
																      {'layerNm':'LT_C_UQ126', 'title':'보존지구'},
																      {'layerNm':'LT_C_UQ127', 'title':'시설보호지구'},
																      {'layerNm':'LT_C_UQ128', 'title':'취락지구'},
																      {'layerNm':'LT_C_UQ129', 'title':'개발진흥지구'},
																      {'layerNm':'LT_C_UQ130', 'title':'특정용도제한지구'}]},
					       {'group':'3', 'title':'용도구역도','layers':[{'layerNm':'LT_C_UQ141', 'title':'국토계획구역'},
																      {'layerNm':'LT_C_UQ162', 'title':'도시자연공원구역'},
																      {'layerNm':'LT_C_UD801', 'title':'개발제한구역'}]},
					       {'group':'4', 'title':'행정구역도','layers':[{'layerNm':'LT_C_ADSIDO', 'title':'광역시도'},
																      {'layerNm':'LT_C_ADSIGG', 'title':'시군구'},
																      {'layerNm':'LT_C_ADEMD', 'title':'읍면동'},
																      {'layerNm':'LT_C_ADRI', 'title':'리'}]},
								
					     ];
	
	var mapDiv;
	var highlightFeature;
	
	
	// 지도클릭후 선택된 feature 가 있을 시 콜백
	var mapClickCallback;
	
	// 지도핸들링이 끝나고 호출되는 콜백
	var mapHandleEndCallback
	
	// feature 편집 후 완료버튼 클릭시 콜백함수
	var completeCallback;
	
	// feature 말풍선 클릭시 콜백함수
	var featureInfoCallback;
	
	// 
	var featureDragTag = DRAG_MODE_NONE;
	
	var initParam = {
			worldProjection:'EPSG:4326',
			targetProjection:'EPSG:3857',
			layerBbox:[50119.84,967246.47,2176674.68,12765761.31],
			resoutions:[2048,1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5],
			center :{
				lon:127.0396037,
				lat: 37.5010226,
				zoom:16
			}
		};
	
	// feature drag drop 을 위한 interaction 구현
    var draghandler = new ol.interaction.Pointer({
        handleDownEvent : function(event){
            var feature = event.map.forEachFeatureAtPixel(event.pixel,
                function(feature, layer) {
                  	return feature;
                });

            if (feature) {
            	var fitem = feature.get('item')
            	if(fitem != null && fitem.TAG == featureDragTag){
            		this.coordinate_ = event.coordinate;
                	this.feature_ = feature;	
                	featureByReg = feature;
            	}else{
            		feature = null;
            	}
            }
            return !!feature;
        },
        handleDragEvent : function(event){
        	
        	popupOverlay.setPosition(undefined);
        	
        	var geometry = this.feature_.getGeometry();
            var gtype = geometry.getType();
            
            if(gtype == 'Point'){
          	  	geometry.setCoordinates(event.coordinate);
            } else{
          	  	var deltaX = event.coordinate[0] - this.coordinate_[0];
                var deltaY = event.coordinate[1] - this.coordinate_[1];
                geometry.translate(deltaX, deltaY);    
            }
            this.coordinate_[0] = event.coordinate[0];
            this.coordinate_[1] = event.coordinate[1];
        },
        handleMoveEvent : function(){
            //console.log('handle move')
        },
        handleUpEvent : function(event){
        	
        	if(featureRegMode){
        		showPopup(this.feature_,null, DRAG_MODE_REG);
        	}else{
        		showPopup(this.feature_,null, featureDragTag);
        	}
        	
        	this.coordinate_ = null;
            this.feature_ = null;
            return false;
        }
    });
    
    var getAddress = function(addr){
    	if(addr == null || addr.result == null || addr.result.items == null)
    		return '';
    	
    	for(var i=0; i<addr.result.items.length; i++){
    		if(!addr.result.items[i].isRoadAddress)
    			return addr.result.items[i].address;
    	}
    	return '';
    };
    				
	var projection = new ol.proj.Projection({
        code: 'EPSG:4326',
        units: 'degrees',
        axisOrientation: 'neu'
	});
	
	var getMousePositionControl = function(){
		return new ol.control.MousePosition({
			className: 'custom-mouse-position',
//    		target: document.getElementById('location'),
			coordinateFormat: ol.coordinate.createStringXY(5),
			undefinedHTML: '&nbsp;'
		});
	}
	var createMap = function(mapDivId) {
		mapDiv = mapDivId;
		
		var centerPoint = ol.proj.transform([initParam.center.lon, initParam.center.lat], initParam.worldProjection, initParam.targetProjection);
		var zoom = initParam.center.zoom;
		
		var layerInfos = [];
		layerInfos.push({layerNm:'airkorea_real2',isVisible:false,isTiled:true,cql:'RESULT_DATE=\'20180103\' AND RESULT_HOUR=\'06\'',opacity:0.7});
		layerInfos.push({layerNm:'airkorea_real',isVisible:false,isTiled:true,cql:'RESULT_DATE=\'20180103\' AND RESULT_HOUR=\'06\'',opacity:0.7});
		
		//행정구역
		layerInfos.push({layerNm:'dis_sido',isVisible:false,isTiled:true,cql:null,opacity:0.7});
		layerInfos.push({layerNm:'dis_gu',isVisible:false,isTiled:true,cql:null,opacity:0.7});
		layerInfos.push({layerNm:'dis_dong',isVisible:false,isTiled:true,cql:null,opacity:0.7});
		layerInfos.push({layerNm:'dis_ri',isVisible:false,isTiled:true,cql:null,opacity:0.7});
		
//		templateMapLayers = _AirKoreaLayer.createTileLayer(layerInfos);
		templateMapLayers[0] = new ol.layer.Tile({
							            	source: new ol.source.OSM(),
							            	projection: "EPSG:4626",
						                    displayProjection: "EPSG:3857",
						                    name:'osm'});
		
	    templateMapLayers[1] 	= _VWorldLayer.createVWorldBaseMapLayer({isVisible:true});
	    templateMapLayers[2] 	= _VWorldLayer.createVWorldSatelliteMapLayer({isVisible:false});
	    templateMapLayers[3] 	= _VWorldLayer.createVWorldHybridMapLayer({isVisible:false});
	    templateMapLayers[4] 	= _VWorldLayer.createVWorldGrayMapLayer({isVisible:false});
	    
	    
	    var tileLayer = _AirKoreaLayer.createTileLayer(layerInfos);
	    templateMapLayers[5] =  tileLayer[0];
	    templateMapLayers[6] =  tileLayer[1];
	    
	    templateMapLayers[7] =  tileLayer[2];
	    templateMapLayers[8] =  tileLayer[3];
	    templateMapLayers[9] =  tileLayer[4];
	    templateMapLayers[10] =  tileLayer[5];
	    
	    var layerIdx = 11;
	    
	    for(var i=0; i<vworldWmsLayers.length; i++){
	    	for(var j=0; j<vworldWmsLayers[i].layers.length; j++){
	    		templateMapLayers[layerIdx] 	= _VWorldLayer.createVWroldWMSTileMapLayer({layers:vworldWmsLayers[i].layers[j].layerNm, isVisible:false, isTiled:true, opacity:1.0});	
	    		layerIdx++;
	    	}
	    }
	    templateMap = new ol.Map({
	    	controls: ol.control.defaults({
	    		attribution: false,
	    	    rotate: false,
	    	    zoom: false
	    	  }).extend([new ol.interaction.DragRotate({
	    	        condition: function(e){
	    	        	return false;
	    	        }
	    	    })]), 
	    	target: mapDiv,
	    	layers: templateMapLayers,
	    	view: new ol.View({
	    		enableRotation:false, // 모바일에서 투터치로 지도가 회전되는 것 막음
	    		rotation:0,
	    		center:centerPoint,
	    		minZoom:5,
				maxZoom:19,
				zoom:zoom
	    	})
	    });
	    
	    //templateMap.getView().fit(bounds, templateMap.getSize());
	    
//	    templateMap.addInteraction(draghandler);
	    
	    // 현재위치를 위한 geolocation 설정
	    setGeoLocation();
	    
	    // feature 클릭시 팝업을 띄우기 위한 초기화
	    setPopupOverlay();
	    
	    // polygon feature 클릭시 하이라이트
	    setHighlightFeature();
	    
	    //
	    setMapEvent();
	    
	    // VWORLD wms layer on/off check box 생성
	    setVworldWmsLayerCheckbox();
	}

	var setVworldWmsLayerCheckbox = function(){
		var box = '<div id="legend" style="background-color: #ffffff;">';
		for(var i=0; i<vworldWmsLayers.length; i++){
			box += '<h5 style="margin: 5px;">'+vworldWmsLayers[i].title+'</h3>';
			
	    	for(var j=0; j<vworldWmsLayers[i].layers.length; j++){
	    		box += '<div style="margin-bottom: 5px;">';
	    		box += '<span><input type="checkbox" class="vworldWms" layerNm="'+vworldWmsLayers[i].layers[j].layerNm+'"></span>';
	    		box += '<font size="1">'+vworldWmsLayers[i].layers[j].title;+'</font>';
	    		box += '</div>';
	    	}
	    }
		$('#vworldWmsDiv').html(box);
		
		$('.vworldWms').on('click', function(){
			var target = $(this);
			var layerNm = target.attr('layerNm');
			var layer = templateMap.getLayerForName(layerNm);
			var onoff = target.is(':checked');
			
			if(layer != null){
				layer.setVisible(onoff);
			}
			if(onoff){
				_VWorldLayer.setVworldWMSLegendImg({imgId:'wmsLegendImg', 'layerNm':layerNm, 'style':layerNm})
			}
			
		});
	}
	
	var setMapEvent = function(){
		
		// 벡터레이어로 올렸을때 feature select
		templateMap.on('singleclick', function(evt) {
			evt.preventDefault();
			
	    	popupOverlay.setPosition(undefined);
	    	
	    });
		
//		templateMap.getView().on('change:resolution', function(event){
//			event.preventDefault();
//			
//			if(mapHandleEndCallback != null){
//				mapHandleEndCallback.apply(this, [templateMap])
//			}
//			
//		});
		templateMap.on('moveend', function(event){
			event.preventDefault();
			
			if(mapHandleEndCallback != null){
				mapHandleEndCallback.apply(this, [templateMap])
			}
		});
	}
	
	var centerMap = function(long,lat,zoomLavel){
		var centerPoint; 

		if(typeof(long) == 'string')
			long = parseFloat(long);
		
		if(typeof(lat) == 'string')
			lat = parseFloat(lat);
		
		if(long > 1000000 && lat > 400000)
			centerPoint = [long, lat];
		else{
			if(long < 110 && lat > 40){
				var tmp = lat;
				lat = long;
				long = tmp;
			}
			centerPoint = ol.proj.transform([long, lat], initParam.worldProjection, initParam.targetProjection);	
		}
		
		templateMap.getView().setCenter(centerPoint);
		if(zoomLavel !=null)
			templateMap.getView().setZoom(zoomLavel);
	}	
	
	var addLayer = function(layer){
		if(layer == null)
			return;
		if(templateMap == null)
			return;
		templateMap.addLayer(layer);
		templateMapLayers.push(layer);
	}
	var addVectorLayer = function(features){
		
		if(features == null || features.length <= 0)
			return;
		if(templateMap == null)
			return;
		
		var vectorLayer = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: features
			})
		});
		
		templateMap.addLayer(vectorLayer);
		templateMapLayers.push(vectorLayer);
		
		return vectorLayer;
	}
	var removeLayer = function(layer){
		if(templateMap == null)
			return;
		templateMap.removeLayer(layer);
	}
	var setPopupOverlay = function(){
		popupOverlay = new ol.Overlay({
	    	element: document.getElementById('popup')
	    });
		templateMap.addOverlay(popupOverlay);
	}
	var setHighlightFeature = function(){
		var highlightFeatureStyleCache = {};
		featureHighlightOverlay = new ol.layer.Vector({
	        source: new ol.source.Vector(),
	        map: templateMap,
	        style: function(feature, resolution) {
	        	var text = resolution < 5000 ? feature.get('name') : '';
	        	if (!highlightFeatureStyleCache[text]) {
	        		highlightFeatureStyleCache[text] = new ol.style.Style({
	        			stroke: new ol.style.Stroke({
	        				color: '#f00',
	        				width: 1
	        			}),
	        			fill: new ol.style.Fill({
	        				color: 'rgba(255,0,0,0.1)'
	        			})
	        		});
	        	}
	          return highlightFeatureStyleCache[text];
	        }
		});
	}
	var setGeoLocation = function(){
		geolocation = new ol.Geolocation({
			projection: templateMap.getView().getProjection()
		});
		// update the HTML page when the position changes.
		geolocation.on('change', function(e) {
		});

		// handle geolocation error.
		geolocation.on('error', function(error) {
		});

		var accuracyFeature = new ol.Feature();
		
		geolocation.on('change:accuracyGeometry', function() {
			accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
		});

		var positionFeature = new ol.Feature();
		positionFeature.setStyle(new ol.style.Style({
			image: new ol.style.Circle({
				radius: 6,
				fill: new ol.style.Fill({
					color: '#3399CC'
		    }),
		    stroke: new ol.style.Stroke({
		    	color: '#fff',
		    	width: 2
		    	})
			})
		}));

		geolocation.on('change:position', function() {
			var coordinates = geolocation.getPosition();
			positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
		});

		geolocationOverlay = new ol.layer.Vector({
			map: templateMap,
			source: new ol.source.Vector({
				features: [accuracyFeature, positionFeature]
			})
		});
	}
	
	var setFeatureRegMode = function(flag, icon, coord){
		
		featureRegMode = flag;
		featureRegIcon = icon;
		
		if(flag){
			setFeatureDragMode(true,DRAG_MODE_REG);
			
			var points  = templateMap.getView().getCenter();
			
			if(coord != null && coord.length == 2)
				points = convertLonLatCoord(coord, true);
				
			if(featureRegLayer != null){
				featureRegLayer.setVisible(true);
				featureByReg.setGeometry(new ol.geom.Point(points));
			}else{
				featureByReg = new ol.Feature({
					  geometry: new ol.geom.Point(points),
					  item: {TAG:DRAG_MODE_REG}
				});
				
				featureByReg.setStyle(new ol.style.Style({
					image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
						anchor: [0.5, 46],
						anchorXUnits: 'fraction',
						anchorYUnits: 'pixels',
						opacity: 1.0,
						src: icon
					}))
				}));

				featureRegLayer = new ol.layer.Vector({
					map: templateMap,
					source: new ol.source.Vector({
						features: [featureByReg]
					})
				});
//				templateMap.addLayer(featureRegLayer);
//				featureRegLayer.setVisible(true);
				showPopup(featureByReg);
			}
		}else{
			featureRegLayer.setVisible(false);
		}
	}
	var getFeatureRegModeState = function(){
		var state = {};
		state.flag = featureRegMode;
		state.icon = featureRegIcon;
		state.callback = completeCallback;
		
		return state;
	}
	
	var setCompleteEvent = function(){
		$('#completeBtn').off(Common.clickEventNm).on(Common.clickEventNm, function(evt){
			if(completeCallback != null){
				completeCallback.apply(this, [featureByReg]);
			}
		});
	}
	//
	var setFeatureDragMode = function(flag, tag){
		if(flag){
			featureDragTag = tag;
			templateMap.addInteraction(draghandler);	
		}else{
			featureDragTag = DRAG_MODE_NONE;
			templateMap.removeInteraction(draghandler);	
		}
		
	}
	// 현재위치 표시
	var setGeoLocationVisible = function(isVisible){
		geolocationOverlay.setVisible(isVisible);
		geolocation.setTracking(isVisible);
	}
	
	// 배경맵 지우기
	var hideBaseMap = function(){
		for(var i=1;i<5;i++){
			templateMapLayers[i].setVisible(false);
		}	
	}
	// 기본지도
	var showDefautMap = function(){
		for(var i=1;i<5;i++){
			templateMapLayers[i].setVisible(i==1?true:false);
		}
	}
	// 항공지도 
	var showAirMap = function(){
		for(var i=1;i<5;i++){
			templateMapLayers[i].setVisible((i==1 || i==4)?false:true);
		}
	}
	// 백지도
	var showGrayMap = function(){
		for(var i=1;i<5;i++){
			templateMapLayers[i].setVisible(i==4?true:false);
		}
	}
	// templateMap 자원 클리어
	var destroy = function(){
		templateMapLayers = [];
		
		featureInfoCallback = null;
		completeCallback = null;
		mapClickCallback = null;
		mapHandleEndCallback = null;
		
		if(templateMap != null){
			templateMap.setTarget(null);
			templateMap = null;	
		}
	}
	// 좌표 -> 주소 변환
	var convertCoordToAddress = function(parameter){
//		var url = vworldAddrUrl.replace('#X#', parameter.x).replace('#Y#', parameter.y);

		var url = nhnAddrUrl.replace('#X#', parameter.x).replace('#Y#', parameter.y);
//		
		$.getJSON(url, parameter.callback);
	}
	
	var getMapBounds = function(wkt){
		var extent = templateMap.getView().calculateExtent(templateMap.getSize());
		return ol.proj.transformExtent(extent, 'EPSG:3857', wkt);
	}
	var convertLonLatCoord = function(coord, flag){
		if(flag){
			if(coord[0] > 1000000 && coord[1] > 400000)
				return coord;
		
			return ol.proj.transform(coord, initParam.worldProjection, initParam.targetProjection);
		}
		else
			return ol.proj.transform(coord, initParam.targetProjection, initParam.worldProjection);
	}
	var showDistrictLayer = function(index){
		templateMapLayers[index].setVisible(true);
	}
	var hideDistrictLayer = function(index){
		templateMapLayers[index].setVisible(false);
	}
	var addHeatMap = function(){
		var heatMapLayer = new ol.layer.Heatmap({
						name:'airKoreaHeatmapLayer',
						source:new ol.source.Vector({
						url: Common.geoServerUrl+'/geoserver/airkorea/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=airkorea:cmaq_9km_pt2&maxFeatures=5000&outputFormat=application/json&CQL_FILTER=RESULT_DATE=\'20180103\' AND RESULT_HOUR=\'06\'',
						format: new ol.format.GeoJSON({
							featureProjection:'EPSG:3857'
							})
						}),
						blur: parseInt($('#blur').val(), 10),
						radius: parseInt($('#radius').val(), 10)
	      			});

		heatMapLayer.getSource().on('addfeature', function(event) {
			var coVal = parseFloat(event.feature.get('CO'));
	        var sum = coVal-parseInt(coVal);
	        event.feature.set('weight', sum);
		});
	    templateMap.addLayer(heatMapLayer);
	      
	    templateMapLayers.push(heatMapLayer);
	    
	    var blur = document.getElementById('blur');
	    var radius = document.getElementById('radius');
	    blur.addEventListener('input', function() {
	    	heatMapLayer.setBlur(parseInt(blur.value, 10));
	    });

	    radius.addEventListener('input', function() {
	    	heatMapLayer.setRadius(parseInt(radius.value, 10));
	    });
	}
	// public functions
	return {

		init : function(mapDivId) {
			var me = this;
			destroy();
			
			createMap(mapDivId);

			return me;
		},
		centerMap: function(long, lat, zoomLavel){
			centerMap(long, lat, zoomLavel);
		},
		getMap: function(){
			return templateMap;
		},
		getZoom: function(){
			return templateMap.getView().getZoom();
		},
		addLayer: function(layer){
			addLayer(layer);
		},
		addVectorLayer: function(features){
			return addVectorLayer(features);
		},
		setGeoLocationVisible: function(isVisible){
			setGeoLocationVisible(isVisible);
		},
		hideBaseMap: function(){
			hideBaseMap();
		},
		showDefautMap: function(){
			showDefautMap();
		},
		showAirMap: function(){
			showAirMap();
		},
		showGrayMap: function(){
			showGrayMap();
		},
		destroy: function(){
			destroy();
		},
		convertCoordToAddress: function(parameter){
			convertCoordToAddress(parameter);
		},
		createPointCoord: function(callback){
			createPointCoord(callback);
		},
		setFeatureInfoCallback: function(callback){
			featureInfoCallback = callback;
		},
		setCompleteCallback: function(callback){
			completeCallback = callback;
		},
		showPopup: function(feature,zoom, tag){
			showPopup(feature,zoom, tag);
		},
		setFeatureDragMode: function(onoffFlag, tag){
			setFeatureDragMode(onoffFlag, tag);
		},
		setFeatureRegMode: function(onoffFlag,icon, coord){
			setFeatureRegMode(onoffFlag, icon, coord);	
		},
		getFeatureRegModeState: function(){
			return getFeatureRegModeState();
		},
		setMapClickCallback: function(callback){
			mapClickCallback = callback;
		},
		removeLayer: function(layer){
			removeLayer(layer);
		},
		clearPopup: function(){
			clearPopup();
		},
		getMapBounds: function(wkt){
			return getMapBounds(wkt);
		},
		convertLonLatCoord: function(coord, flag){
			return convertLonLatCoord(coord, flag);
		},
		setMapHandleEndCallback: function(callback){
			mapHandleEndCallback = callback;
		},
		getLayers: function(){
			return templateMapLayers;
		},
		showDistrictLayer: function(index){
			showDistrictLayer(index)
		},
		hideDistrictLayer: function(index){
			hideDistrictLayer(index);
		},
		addHeatMap: function(){
			addHeatMap();
		}
	};
}();


