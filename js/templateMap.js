var _TemplateMap = function() {
	// private functions & variables

	var TAG = '[TEMPLATE MAP]';
	var vworldAddrUrl = 'http://apis.vworld.kr/coord2jibun.do?x=#X#&y=#Y#&apiKey=7A0635A7-67B9-39CD-96BC-65D901E709B3&domain=http://www.eburin.net&output=json&epsg=EPSG:4326&callback=?';
	var nhnAddrUrl    = 'http://openapi.map.naver.com/api/reversegeocode?key=ed361f09f893f6489eed72ec266fa190&encoding=utf-8&coord=latlng&output=json&callback=?&query=#X#,#Y#';
	
	var DRAG_MODE_NONE = 'NONE';
	var DRAG_MODE_SI   = 'SI';
	var DRAG_MODE_ROAD   = 'ROAD';
	var DRAG_MODE_OPM  = 'OPM';
	var DRAG_MODE_CSM  = 'CSM';

	var DRAG_MODE_CMLOC  = 'CMLOC';
	var DRAG_MODE_NPLOC  = 'NPLOC';
	var DRAG_MODE_SCLOC  = 'SCLOC';
	var DRAG_MODE_MEMO   = 'MEMO';
	
	var DRAG_MODE_LEVEE  = 'LEVEE';
	var DRAG_MODE_DAM   = 'DAM';
	
	var DRAG_MODE_C162  = 'C162';
	var DRAG_MODE_A001  = 'FAC_A001';
	var DRAG_MODE_A002  = 'FAC_A002';
	var DRAG_MODE_AAA  = 'FAC_AAA';
	var DRAG_MODE_BBB  = 'FAC_BBB';
	var DRAG_MODE_CCC  = 'FAC_CCC';
	var DRAG_MODE_DDD  = 'FAC_DDD';
	var DRAG_MODE_EEE  = 'FAC_EEE';
	var DRAG_MODE_FFF  = 'FAC_FFF';
	var DRAG_MODE_GGG  = 'FAC_GGG';
	
	var DRAG_MODE_REG  = 'REG';
	
	var templateMap;
	var templateMapLayers = [];
	
	var mapDiv;
	var popupOverlay;
	var featureHighlightOverlay;
	var highlightFeature;
	
	var geolocation;
	var geolocationOverlay;
	
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
	
	// feature 등록을 위한 부분
	var featureRegMode = false;
	var featureRegIcon;
	var featureRegLayer;
	var featureByReg;
	
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
		
	    templateMapLayers[0] 	= _VWorldLayer.createVWorldBaseMapLayer({isVisible:true});
	    templateMapLayers[1] 	= _VWorldLayer.createVWorldSatelliteMapLayer({isVisible:false});
	    templateMapLayers[2] 	= _VWorldLayer.createVWorldHybridMapLayer({isVisible:false});
	    
	    templateMap = new ol.Map({
	    	controls: ol.control.defaults({
	    		attribution: false,
	    	    rotate: false
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
	    		minZoom:6,
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
	}

	var setMapEvent = function(){
		
		// 벡터레이어로 올렸을때 feature select
		templateMap.on('singleclick', function(evt) {
			evt.preventDefault();
			
	    	popupOverlay.setPosition(undefined);
	    	
	    	var features = [];
	    	templateMap.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
	    		features.push(feature);
	        });
	    		
	    	if(mapClickCallback != null){
	    		if(featureRegMode && features.length <=0){
	    			var coord = templateMap.getCoordinateFromPixel(evt.pixel);
	    			featureByReg.setGeometry(new ol.geom.Point(coord));
	    			features[0] = featureByReg;
	    		}
				mapClickCallback.apply(this, [evt.coordinate, features, featureRegMode]);
			}
	    	
//	    	if(features == null || features.length==0){
//	    		if(featureRegMode){
//	    			var coord = templateMap.getCoordinateFromPixel(evt.pixel);
//	    			featureByReg.setGeometry(new ol.geom.Point(coord));
//	    			showPopup(featureByReg,null, DRAG_MODE_REG);
//	    		}
//	    	}
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
	
	var showPopup = function(feature,zoom,tag){
		if(feature == null)
			return;
		
		var featureItem  = feature.get('item');

		if(tag == null)
			tag = featureItem.TAG
			
		var geometry = feature.getGeometry();
		
		var coord = geometry.getCoordinates();
		
		if(featureItem.TAG == DRAG_MODE_C162){
			var polygon = new ol.geom.MultiPolygon(coord);
			coord = polygon.getInteriorPoints().getCoordinates()[0];
		}else if(featureItem.TAG == DRAG_MODE_DAM){
			var polygon = new ol.geom.Polygon(coord);
			coord = polygon.getInteriorPoint().getCoordinates();
		}else if(featureItem.TAG == DRAG_MODE_A001 || featureItem.TAG == DRAG_MODE_A002){
			coord = [parseFloat(featureItem.lnd_coo), parseFloat(featureItem.ltd_coo)];
		}else if(featureItem.TAG == DRAG_MODE_LEVEE){
			var line = new ol.geom.LineString(coord);
			var coords = line.getCoordinates();
			var idx = parseInt(coords.length/2);
			coord = coords[idx];
		}
		
		coord = convertLonLatCoord(coord, true);
		
		if(zoom != null){
			_TemplateMap.centerMap(coord[0],coord[1], zoom);
		}
		if(tag == DRAG_MODE_SI || tag == DRAG_MODE_ROAD || tag == DRAG_MODE_CMLOC){
			if(tag == featureDragTag){
				var lonlat = convertLonLatCoord(coord, false);
				convertCoordToAddress({x:lonlat[0]+"", y:lonlat[1]+"", callback:function(addr){

					var address = getAddress(addr);
					
					featureItem.addr = address;
					
					$('#popup-content').html('<ul style="padding-left:0px; list-style:none;"><li><a href="javascript:void(0);" style="color: black; font-weight: normal; text-decoration: none;" id="finfoLabel"> '+featureItem.sisulNm+'</a></li><li>'+address+'</li><li ><a style="width:80%;" class="ui-btn ui-shadow ui-corner-all ui-btn-inline ui-mini" href="javascript:void(0)" id="completeBtn">완료</a></li></ul>');
					setCompleteEvent();
				}});
			} else{
				$('#popup-content').html('<ul style="padding-left:0px; list-style:none;"><li><a href="javascript:void(0);" style="color: black; font-weight: normal; text-decoration: none;" id="finfoLabel">'+featureItem.sisulNm+'</a></li></ul>');
			}
			
			$('#finfoLabel').off(Common.clickEventNm).on(Common.clickEventNm, function(event){
				if(featureInfoCallback != null)
					featureInfoCallback.apply(this, [feature]);
			});
			
		}else if(tag == DRAG_MODE_REG){
			var lonlat = convertLonLatCoord(coord, false);
			
			convertCoordToAddress({x:lonlat[0]+"", y:lonlat[1]+"", callback:function(addr){
				
				var address = getAddress(addr);
				
				featureByReg.set('item', {TAG:'REG', addr:address});
				
				$('#popup-content').html('<ul style="padding-left:0px; list-style:none;"><li>'+address+'</li><li ><li ><a style="width:80%;" class="ui-btn ui-shadow ui-corner-all ui-btn-inline ui-mini" href="javascript:void(0)" id="completeBtn">완료</a></li></ul>');
				
				setCompleteEvent();
			}});	
		}else if(tag == DRAG_MODE_OPM){
			if(tag == featureDragTag){
				$('#popup-content').html('<ul style="padding-left:0px; list-style:none;"><li><a href="javascript:void(0);" style="color: black; font-weight: normal; text-decoration: none;" id="finfoLabel"> '+featureItem.idx+'</a></li><li ><a style="width:80%;" class="ui-btn ui-shadow ui-corner-all ui-btn-inline ui-mini" href="javascript:void(0)" id="completeBtn">완료</a></li></ul>');
				setCompleteEvent();
			} else{
				$('#popup-content').html('<ul style="padding-left:0px; list-style:none;"><li><a href="javascript:void(0);" style="color: black; font-weight: normal; text-decoration: none;" id="finfoLabel">'+featureItem.idx+'</a></li></ul>');
			}
			
			$('#finfoLabel').off(Common.clickEventNm).on(Common.clickEventNm, function(event){
				if(featureInfoCallback != null)
					featureInfoCallback.apply(this, [feature]);
			});
		}else if(tag == DRAG_MODE_CSM){
			
		}else if(tag == DRAG_MODE_NPLOC){
			
			$('#popup-content').html('<ul style="padding-left:0px; list-style:none;"><li><a href="javascript:void(0);" style="color: black; font-weight: normal; text-decoration: none;" id="finfoLabel">'+featureItem.idx+'</a></li></ul>');
			$('#finfoLabel').off(Common.clickEventNm).on(Common.clickEventNm, function(event){
				if(featureInfoCallback != null)
					featureInfoCallback.apply(this, [feature]);
			});
		}else if(tag == DRAG_MODE_SCLOC){
			
			$('#popup-content').html('<ul style="padding-left:0px; list-style:none;"><li><a href="javascript:void(0);" style="color: black; font-weight: normal; text-decoration: none;" id="finfoLabel">'+featureItem.constructionNm+'</a></li></ul>');
			$('#finfoLabel').off(Common.clickEventNm).on(Common.clickEventNm, function(event){
				if(featureInfoCallback != null)
					featureInfoCallback.apply(this, [feature]);
			});
		}else if(tag == DRAG_MODE_MEMO){
			
			$('#popup-content').html('<ul style="padding-left:0px; list-style:none;"><li><a href="javascript:void(0);" style="color: black; font-weight: normal; text-decoration: none;" id="finfoLabel">'+featureItem.title+'</a></li></ul>');
			$('#finfoLabel').off(Common.clickEventNm).on(Common.clickEventNm, function(event){
				if(featureInfoCallback != null)
					featureInfoCallback.apply(this, [feature]);
			});
		}else{
			
			$('#popup').css('margin-bottom', '0px');
			$('#popup-content').html('<ul style="padding-left:0px; list-style:none;"><li><a href="javascript:void(0);" style="color: black; font-weight: normal; text-decoration: none;" id="finfoLabel">'+featureItem[featureItem.keyNm]+'</a></li></ul>');
			$('#finfoLabel').off(Common.clickEventNm).on(Common.clickEventNm, function(event){
				if(featureInfoCallback != null)
					featureInfoCallback.apply(this, [feature]);
			});
		}
		popupOverlay.setPosition(coord);
	}
	
	var clearPopup = function(){
		popupOverlay.setPosition(undefined);
		if(featureRegLayer != null)
			featureRegLayer.setVisible(false);
	}
	var centerMap = function(long,lat,zoomLavel){
		var centerPoint; 

		if(typeof(long) == 'string')
			long = parseFloat(long);
		
		if(typeof(lat) == 'string')
			lat = parseFloat(lat);
		
		if(long > 10000000 && lat > 4000000)
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
	
	// 기본지도
	var showDefautMap = function(){
		for(var i=0;i<3;i++){
			templateMapLayers[i].setVisible(i==0?true:false);
		}
	}
	// 항공지도 
	var showAirMap = function(){
		for(var i=0;i<3;i++){
			templateMapLayers[i].setVisible(i==0?false:true);
		}
	}
	// templateMap 자원 클리어
	var destroy = function(){
		
		featureRegIcon = null;
		featureRegLayer = null;
		featureByReg = null;
		featureRegMode = false;
		
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
	
	var createPointCoord= function(callback){
		
	}
	var getMapBounds = function(wkt){
		var extent = templateMap.getView().calculateExtent(templateMap.getSize());
		return ol.proj.transformExtent(extent, 'EPSG:3857', wkt);
	}
	var convertLonLatCoord = function(coord, flag){
		if(flag){
			if(coord[0] > 10000000 && coord[1] > 4000000)
				return coord;
		
			return ol.proj.transform(coord, initParam.worldProjection, initParam.targetProjection);
		}
		else
			return ol.proj.transform(coord, initParam.targetProjection, initParam.worldProjection);
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
		showDefautMap: function(){
			showDefautMap();
		},
		showAirMap: function(){
			showAirMap();
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
		}
		
	};
}();


