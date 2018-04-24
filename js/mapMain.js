var $mapMain = function() {

	// private functions & variables
	var reverseFeatures = []; 
	var reverseInterval;
	var reverseVectorLayer;
	
	var latticInterval;
	
	var setInitMap = function() {
		_AirKoreaMap.init('map');
		if (Common.shape == null) {
			Common.shape = {
				type : 'Point',
				coordinates : [ 126.978371, 37.5666091 ]
			}
		}

		_AirKoreaMap.centerMap(Common.shape.coordinates[0],
				Common.shape.coordinates[1], 7);

		setMapEvent();
	}
	var setMapEvent = function() {
		
		$('#latValSel').on('change', function(){
			
			stopLattice();
			
			hideLattice();
			
			latVal  = $(this).val();
			showLattice();
		});
		_AirKoreaMap.setFeatureInfoCallback(function(feature) {
		});
		_AirKoreaMap.setMapClickCallback(function(coord, features, featureRegMode) {
		});
	}
	var createTextStyleFac = function(feature, resolution) {
		var align = 'center';
		var baseline = 'top';
		var size = '14px';
		var offsetX = 0;
		var offsetY = 10;
		var weight = 'bold';
		var placement = 'point';
		var maxAngle = undefined;
		var exceedLength = undefined;
		var rotation = 0.0;
		var font = weight + ' ' + size + ' Arial';
		var fillColor = '#000000';
		var outlineColor = '#ffffff';
		var outlineWidth = 3;

		return new ol.style.Text({
			textAlign : align == '' ? undefined : align,
			textBaseline : baseline,
			font : font,
			text : getTextFac(feature, resolution),
			fill : new ol.style.Fill({
				color : fillColor
			}),
			stroke : new ol.style.Stroke({
				color : outlineColor,
				width : outlineWidth
			}),
			offsetX : offsetX,
			offsetY : offsetY,
			placement : placement,
			maxAngle : maxAngle,
			exceedLength : exceedLength,
			rotation : rotation
		});
	};
	var createTextStyle = function(feature, resolution) {
		var align = 'center';
		var baseline = 'top';
		var size = '14px';
		var offsetX = 0;
		var offsetY = 10;
		var weight = 'bold';
		var placement = 'point';
		var maxAngle = undefined;
		var exceedLength = undefined;
		var rotation = 0.0;
		var font = weight + ' ' + size + ' Arial';
		var fillColor = '#000000';
		var outlineColor = '#ffffff';
		var outlineWidth = 3;

		return new ol.style.Text({
			textAlign : align == '' ? undefined : align,
			textBaseline : baseline,
			font : font,
			text : getText(feature, resolution),
			fill : new ol.style.Fill({
				color : fillColor
			}),
			stroke : new ol.style.Stroke({
				color : outlineColor,
				width : outlineWidth
			}),
			offsetX : offsetX,
			offsetY : offsetY,
			placement : placement,
			maxAngle : maxAngle,
			exceedLength : exceedLength,
			rotation : rotation
		});
	};
	var onoffFlag = false;
	var onOff = function(){
		if(onoffFlag){
			onoffFlag = false;
			getText = function(feature, resolution){
				var text = feature.get('name');
				text = stringDivider(text, 26, '\n');
				$('#currentDate').val(text);
				return text;
			}
		}else{
			onoffFlag = true;
			getText = function(feature, resolution){
				var text = feature.get('name');
				text = stringDivider(text, 26, '\n');
				$('#currentDate').val(text);
				return '';
			}
		}		
	}
	
	var facOnOffFlag = false;
	var labelOnOffFac = function(){
		if(facOnOffFlag){
			facOnOffFlag = false;
			getTextFac = function(feature, resolution){
				var text = feature.get('name');
				return stringDivider(text, 26, '\n');
			}
		}else{
			facOnOffFlag = true;
			getTextFac = function(feature, resolution){
				return '';
			}
		}		
	}
	
	var getText = function(feature, resolution) {
		var text = feature.get('name');
		text = stringDivider(text, 26, '\n');
		$('#currentDate').val(text);
		return text
	};
	var getTextFac = function(feature, resolution) {
		var text = feature.get('name');
		return stringDivider(text, 26, '\n');
	};
	var stringDivider = function(str, width, spaceReplacer) {
		if (str.length > width) {
			var p = width;
			while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
				p--;
			}
			if (p > 0) {
				var left;
				if (str.substring(p, p + 1) == '-') {
					left = str.substring(0, p + 1);
				} else {
					left = str.substring(0, p);
				}
				var right = str.substring(p + 1);
				return left + spaceReplacer
						+ stringDivider(right, width, spaceReplacer);
			}
		}
		return str;
	}
	
	function pointStyleFunction(feature, resolution) {
		return new ol.style.Style({
			image : new ol.style.Circle({
				radius : 10,
				fill : new ol.style.Fill({
					color : 'rgba(255, 0, 0, 1.0)'
				}),
				stroke : new ol.style.Stroke({
					color : 'red',
					width : 5
				})
			}),
			text : createTextStyle(feature, resolution)
		});
	}
	function polygonStyleFunction(feature, resolution) {
//	    if(parseInt(feature.G.INDEXID) % 9 == 0){
//	    	return [new ol.style.Style({
//		        stroke: new ol.style.Stroke({
//		            color: 'rgba(255,64,0,0.4)',
//		            width: 1
//		        }),
//		        fill: new ol.style.Fill({
//			        color: 'rgba(255, 64, 0, 0.4)'
//			      })
//		    })];
//	    }
//	    if(parseInt(feature.G.INDEXID) % 7 == 0){
//	    	return [new ol.style.Style({
//		        stroke: new ol.style.Stroke({
//		            color: 'rgba(223,58,1,0.4)',
//		            width: 1
//		        }),
//		        fill: new ol.style.Fill({
//			        color: 'rgba(223,58,1, 0.4)'
//			      })
//		    })];
//	    }
//	    if(parseInt(feature.G.INDEXID) % 11 == 0){
//	    	return [new ol.style.Style({
//		        stroke: new ol.style.Stroke({
//		            color: 'rgba(254,154,46,0.4)',
//		            width: 1
//		        }),
//		        fill: new ol.style.Fill({
//			        color: 'rgba(254,154,46, 0.4)'
//			      })
//		    })];
//	    }
//	    else{
//	    	return [new ol.style.Style({
//		        stroke: new ol.style.Stroke({
//		            color: 'rgba(0,255,255,0.1)',
//		            width: 1
//		        }),
//		        fill: new ol.style.Fill({
//			        color: 'rgba(0, 255, 255, 0.1)'
//			      })
//		    })];
//	    }
	    return [new ol.style.Style({
	        stroke: new ol.style.Stroke({
	            color: 'rgba(0,255,255,0.1)',
	            width: 1
	        }),
	        fill: new ol.style.Fill({
		        color: 'rgba(0, 255, 255, 0.1)'
		      })
	    })];
//	    return [new ol.style.Style({
//	        stroke: new ol.style.Stroke({
//	            color: color,
//	            width: 1
//	        }),
//	        fill: new ol.style.Fill({
//		        color: 'rgba(0, 0, 255, 0.1)'
//		      })
//	    })];
	    
//		return new ol.style.Style({
//		    stroke: new ol.style.Stroke({
//		        color: 'blue',
//		        width: 0.1
//		      }),
//		      fill: new ol.style.Fill({
//		        color: 'rgba(0, 0, 255, 0.1)'
//		      })
//		    })
	}
	var startFlag = false;
	var addTestLayer = function() {
		if(startFlag){
			startFlag = false;
			clearInterval(reverseInterval);
			$('#firstAndLastDate').hide();
			$('#currentDate').show();
		}
		
		_AirKoreaMap.removeLayer(reverseVectorLayer);
		startFlag = true;
		var reverseLayer = _AirKoreaLayer.getFeatures('reverse_analy', '',
				function(features) {
					reverseFeatures = [];
			
					for (var i = 0; i <features.features.length; i++) {
						var tfeature = features.features[i];
						var coord = ol.proj.transform([
								tfeature.properties.LONG,
								tfeature.properties.LAT ], 'EPSG:4326',
								'EPSG:3857');
						var prop = tfeature.properties;
						
						var feature = new ol.Feature({geometry:new ol.geom.Point(coord), name:prop.YEAR+'-'+prop.MONTH+'-'+prop.DAY+'-'+prop.TIME+'('+prop.HIGH+')'});
						reverseFeatures.push(feature);
					}

					reverseVectorLayer = new ol.layer.Vector({
						source : new ol.source.Vector({
							features : [reverseFeatures[0]]
						}),
						style : pointStyleFunction
					});

					_AirKoreaMap.addLayer(reverseVectorLayer);
					
					var centerCoord = reverseFeatures[0].getGeometry().getCoordinates();
					_AirKoreaMap.centerMap(centerCoord[0], centerCoord[1]);
					
					var idx = 1;
					reverseInterval = setInterval(function(){
						reverseVectorLayer.getSource().addFeature(reverseFeatures[idx]);
						
						var centerCoord = reverseFeatures[idx].getGeometry().getCoordinates();
						_AirKoreaMap.centerMap(centerCoord[0], centerCoord[1]);
						idx++;
						if(reverseFeatures.length-1 <= idx){
							console.log('END')
							clearInterval(reverseInterval);
							var firstLabel = reverseFeatures[0].get('name');
							firstLabel = stringDivider(firstLabel, 26, '\n');
							
							var lastLabel = reverseFeatures[reverseFeatures.length-1].get('name');
							lastLabel = stringDivider(lastLabel, 26, '\n');
							
							$('#firstAndLastDate').val( lastLabel +' ~ '+firstLabel);
							$('#firstAndLastDate').show();
							$('#currentDate').hide();
							
						}
					}, $('#playInterval').val());
				});

	}
	
	var stop = function(){
		if(reverseInterval != null){
			startFlag = false;
			clearInterval(reverseInterval);
		}
	}
	
	
	var addLattice = function(){
		var latticeLayer = _AirKoreaLayer.getFeatures('CMAQ_9km', 'INDEXID<1500',
				function(result) {
//		var latticeFeatures = [];
		
//		for (var i = 0; i <result.features.length; i++) {
//			var tfeature = result.features[i];
//			
//			var latticeFeature = new ol.Feature({geometry:tfeature.geometry});
//			latticeFeatures.push(latticeFeature);
//		}
		var latticeFeatures = (new ol.format.GeoJSON()).readFeatures(result);
		
		latticeLayer = new ol.layer.Vector({
			source : new ol.source.Vector({
				features : latticeFeatures
			}),
			style : polygonStyleFunction
		});

		_AirKoreaMap.addLayer(latticeLayer);
		
		});
	}
	
	function observerPointStyleFunc(feature, resolution) {
		return new ol.style.Style({
			image: new ol.style.Icon({
				src:'./img/c5.png'
				}),
				text: createTextStyleFac(feature, resolution)
	        });
	}
	
	var facStartFlag = false;
	var facInterval = null;
	
	var playFac = function() {
		var targetLayer = getLayer('observerLayer');
		
		console.log(targetLayer);
		
		var features = targetLayer.getSource().getFeatures();
		
		var facIdx = 2;
		if(facStartFlag){
			facStartFlag = false;
			clearInterval(facInterval);
		}else{
			facStartFlag = true;
			facInterval = setInterval(function(){
				if(facIdx == 24){
					facIdx = 1;
				}
				for(var i=0; i<features.length; i++){
					features[i].set('name', (Math.random() *10).toFixed(3) );
				}
				$('#currentFacDate').val('2017-11-22 '+facIdx+' 시');
				facIdx++;
			}, 3000);
		}
		
	}
	var facFeatures = null;
	
	var addFac = function(){
		var observerLayer = _AirKoreaLayer.getFeatures('observer', '',
				function(result) {
			
			for(var i=0; i<result.features.length; i++){
				result.features[i].properties.name =  (Math.random() *10).toFixed(3);
			}
			
			var observerFeatures = (new ol.format.GeoJSON()).readFeatures(result);
			
			observerLayer = new ol.layer.Vector({
				source : new ol.source.Vector({
					features : observerFeatures
				}),
				style : observerPointStyleFunc,
				name:'observerLayer'
			});
	
			_AirKoreaMap.addLayer(observerLayer);
		
			$('#currentFacDate').val('2017-11-22 1 시');
			
		});
	}
	var latVal = 'real';
	
	var playLattice = function(){
		
		var targetLayer = getLayer('airkorea_'+latVal);
		var airkoreaSource = targetLayer.getSource();
		
		var lattIdx = 6;
		latticInterval = setInterval(function(){
			if(lattIdx == 24){
				lattIdx = 6;
			}
			
			var lattIdxStr = String(lattIdx);
			if(lattIdxStr.length == 1){
				lattIdxStr = '0'+lattIdxStr;
			}
			airkoreaSource.updateParams({'FORMAT': 'image/png', 
				'VERSION': '1.1.0',
				tiled: true,
				LAYERS: 'airkorea:airkorea_'+latVal,
				CQL_FILTER:'RESULT_DATE=\'20180103\' AND RESULT_HOUR=\''+lattIdxStr+'\''
				});
			$('#latticeDate').val('2018-01-03 '+lattIdx+' 시');
			lattIdx++;
		}, 2000);
	}
	var stopLattice = function(){
		clearInterval(latticInterval);
	}
	var showLattice = function(){
		var targetLayer = getLayer('airkorea_'+latVal);
		targetLayer.setVisible(true);
	}
	var hideLattice = function(){
		var targetLayer = getLayer('airkorea_'+latVal);
		targetLayer.setVisible(false);
	}
	var getLayer = function(name){
		var layers = _AirKoreaMap.getLayers();
		for(var i=0; i<layers.length; i++){
			var layerName = layers[i].get('name');
			if(layerName == name){
				return layers[i];
			}
		}
	}
	var showGrayMap = function(){
		_AirKoreaMap.showGrayMap();
	}
	var showDefautMap = function(){
		_AirKoreaMap.showDefautMap();
	}
	var showAirMap = function(){
		_AirKoreaMap.showAirMap();
	}
	var hideBaseMap = function(){
		_AirKoreaMap.hideBaseMap();
	}
	var showDistrictLayer = function(btn, index){
		var target = $('#disMapBtn'+index);
		
		var classNm = target.attr('class');
		if(classNm.indexOf('default') > -1){
			target.removeClass('default');
			target.addClass('success');
			_AirKoreaMap.showDistrictLayer(index+6);
		}else{
			target.removeClass('success');
			target.addClass('default');
			_AirKoreaMap.hideDistrictLayer(index+6);
		}
	}
	var addHeatMap = function(){
		var targetLayer = getLayer('airKoreaHeatmapLayer');
		if(targetLayer != null){
			targetLayer.setVisible(true);
		}else{
			_AirKoreaMap.addHeatMap();	
		}
	}
	var offHeatMap = function(){
		var targetLayer = getLayer('airKoreaHeatmapLayer');
		targetLayer.setVisible(false);
	}
	var startHeatMap = function(){
		var targetLayer = getLayer('airKoreaHeatmapLayer');
		
		var lattIdx = 6;
		latticInterval = setInterval(function(){
			if(lattIdx == 24){
				lattIdx = 6;
			}
			
			var lattIdxStr = String(lattIdx);
			if(lattIdxStr.length == 1){
				lattIdxStr = '0'+lattIdxStr;
			}
			targetLayer.setSource(new ol.source.Vector({
				url: Common.geoServerUrl+'/geoserver/airkorea/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=airkorea:cmaq_9km_pt2&maxFeatures=5000&outputFormat=application/json&CQL_FILTER=RESULT_DATE=\'20180103\' AND RESULT_HOUR=\''+lattIdxStr+'\'',
				format: new ol.format.GeoJSON({
					featureProjection:'EPSG:3857'
					})
				}));
			targetLayer.getSource().on('addfeature', function(event) {
				var coVal = parseFloat(event.feature.get('CO'));
		        var sum = coVal-parseInt(coVal);
		        event.feature.set('weight', sum);
			});
			$('#heatMapDate').val('2018-01-03 '+lattIdx+' 시');
			lattIdx++;
		}, 1000*5);
	}
	// public functions
	return {

		init : function() {
			var me = this;

			setInitMap();

			return me;
		},
		play : function(){
			addTestLayer();
		},
		stop: function(){
			stop();
		},
		onOff: function(){
			onOff();
		},
		addLattice : function(){
			addLattice();
		},
		addFac: function(){
			addFac();
		},
		playFac: function(){
			playFac();
		},
		labelOnOffFac: function(){
			labelOnOffFac();
		},
		playLattice: function(){
			playLattice();
		},
		showLattice: function(){
			showLattice();
		},
		hideLattice: function(){
			hideLattice();
		},
		stopLattice: function(){
			stopLattice();	
		},
		showGrayMap:function(){
			showGrayMap();
		},
		showDefautMap:function(){
			showDefautMap();
		},
		showAirMap:function(){
			showAirMap();
		},
		hideBaseMap:function(){
			hideBaseMap();	
		},
		showDistrictLayer: function(index){
			showDistrictLayer(this, index);
		},
		addHeatMap: function(){
			addHeatMap();
		},
		offHeatMap: function(){
			offHeatMap();
		},
		startHeatMap: function(){
			startHeatMap();
		}
	};

}();
