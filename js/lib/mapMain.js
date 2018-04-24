var $mapMain = undefined;

$('#mapMain').on('pageinit', function() {
    var page = {
        'dom' : $(this),
        'id' : this.id
    };

    var TAG = '[MAP_MAIN ]';
    
    var CURRENT_TYPE;
    
    var TITLE = '';//CODEDEFINE.PAGE_TITLE['MY_BUY'];
    
    var context = page.dom;
    // 이전 화면에서 넘어온 파라매터 정보
    var PARAMS = {type:'CSM'};
    
    var featureListIscroll;
    
    var featureInfoIscroll;
    
    var featureInfoList;
    
    // 현재 위치 on/off
    var locMode = false;
    // 현재 지도 타입 기본=1/항공=2
    var currentMapType = 1;
    
    var csmObj = {};
    
    // 친수지구 레이어
    var CHINSU_KEYNM = 'waf_key'; // 친수지구 키 네임
    var chinsuLayerIscroll;
    
    //  시설물 레이어
    var famLayer;
	
    // 점용 레이어
    var opmLayer;
    
    //관리구역 레이어
    var bsmLayer;
    
    // 담당업무구역 레이어
    var pcmLayer;
    
    // 측점 단면 레이어
    var csmLayer;
    var csmCurrentFeature;
    
    // 친수레이어
    var chinsuLayer;
    var chinFeatures;
    
    // 현장출찰 위치
    var cmlocLayer
    
    // 메모 layer
    var memoLayer
    var memoMapState;
    
    // 시설점검 layer
    var inspectLayer;
    
    // 시설 정보 조회용 템플릿
    var facInfo = [{"key":"sisulCdNm", 		"title":"시설종류"},
                     {"key":"sisulNm", 			"title":"시설명"},
                     {"key":"address", 			"title":"주소"},
                     {"key":"yCoord,xCoord",	"title":"좌표", "suffix":" , "},
                     {"key":"station", 			"title":"측점"},
                     {"key":"riverNm", 			"title":"하천명"},
                     {"key":"mainBuildNm", 		"title":"주요건물명"},
                     {"key":"instYear", 		"title":"설치년도"},
                     
                     {"key":"length", 			"title":"연장",		"where":"sisulCd:F100"},
                     {"key":"floodWaterLevel", 	"title":"홍수위",		"where":"sisulCd:F100"},
                     
                     {"key":"sisulStandard", 	"title":"시설규격",	"where":"sisulCd:F270"},
                     {"key":"mngAgen", 			"title":"운영기관",	"where":"sisulCd:F270"},
                     {"key":"mngUserNm", 		"title":"운영자",		"where":"sisulCd:F270"},
                     {"key":"mngNum", 			"title":"연락처",		"where":"sisulCd:F270"},
                     {"key":"sisulStandard", 	"title":"시설규격",	"where":"sisulCd:not(F100,F200)"},
                     {"key":"mngEntity", 		"title":"관리주체"},
                     {"key":"reference", 		"title":"비고"}];
 // 시설 정보(자전거도로)
    var roadInfo = [{"key":"sisulNm", 		"title":"시설종류"},
                     {"key":"addressEnd", 			"title":"주소"},
                     {"key":"yCoord,xCoord",	"title":"좌표", "suffix":" , "},
                     {"key":"riverNm", 			"title":"하천명"},
                     {"key":"mgrNm", 			"title":"관리기관명"}
                    ];
                     
    // 점용 정보 조회용 템플릿
    var opmInfo = [{"key":"idx", 				"title":"점용허가ID", "where":"idx:lk(OP)"},
                     {"key":"address", 			"title":"위치", 		"where":"idx:lk(OP)"},
                     {"key":"licensor", 		"title":"허가자",		"where":"idx:lk(OP)"},
                     {"key":"licensee",			"title":"피허가자",	"where":"idx:lk(OP)"},
                     {"key":"occPurp", 			"title":"점용목적",	"where":"idx:lk(OP)"},
                     {"key":"occArea", 			"title":"허가면적",	"where":"idx:lk(OP)"},
                     {"key":"occPeriod", 		"title":"점용기간",	"where":"idx:lk(OP)"},
                     {"key":"permFirstPeriod", 	"title":"최초허가일", "where":"idx:lk(OP)"},
                     {"key":"mgrNm", 			"title":"관리기관명",	"where":"idx:lk(OP)"},
                     {"key":"riverNm", 			"title":"하천명",		"where":"idx:lk(OP)"},
                     {"key":"note", 			"title":"비고",		"where":"idx:lk(OP)"},
                     {"key":"mgrId", 			"title":"관리번호",	"where":"idx:nl(OP)"},
                     {"key":"address", 			"title":"주소",		"where":"idx:nl(OP)"},
                     {"key":"occArea", 			"title":"규모(㎡)",	"where":"idx:nl(OP)"},
                     {"key":"illegalUsers", 	"title":"불법 사용자",	"where":"idx:nl(OP)"},
                     {"key":"userNm", 			"title":"신고자",		"where":"idx:nl(OP)"},
                     {"key":"exposing", 		"title":"적발현황",	"where":"idx:nl(OP)"},
                     {"key":"measure", 			"title":"조치현황",	"where":"idx:nl(OP)"}];
                     
    // 친수지구 조회용 템플릿
    var c162Info = [{"key":"waf_key", 		"title":"친수지구 ID" },
                     {"key":"waf_name", 		"title":"친수지구명" },
                     {"key":"ris_name", 		"title":"수계"	},
                     {"key":"riv_name",			"title":"하천"	},
                     {"key":"area", 			"title":"지구면적"	},
                     {"key":"sid,sgg,umd", 		"title":"주소",      "suffix":" "},
                     {"key":"ltd_coo,lnd_coo", 		"title":"좌표",		"suffix":" , "}];
    // 교목
    var facA001Info = [{"key":"tre_nam", 		"title":"교목종류" },
                       {"key":"tre_num", 		"title":"교목수량" }];
         
    // 관목
    var facA002Info = [{"key":"shr_nam", 		"title":"관목종류" },
                       {"key":"shr_num", 		"title":"관목수량" }];
    
    var etcChinsuInfo = [{"key":"fac_name", 		"title":"시설명칭" },
                         {"key":"fac_num", 		"title":"시설수량" },
                         {"key":"ltd_coo,lnd_coo", 	"title":"좌표", "suffix":" , "},
                         {"key":"fac_ind", 		"title":"관리기관" }];
                    
    var featureDetailInfo = {
    							SI:facInfo,
    							ROAD:roadInfo,
    							OPM:opmInfo,
    							C162:c162Info,
    							FAC_A002:facA002Info,
    							FAC_A001:facA001Info,
    							FAC_AAA:etcChinsuInfo,
    							FAC_BBB:etcChinsuInfo,
    							FAC_CCC:etcChinsuInfo,
    							FAC_DDD:etcChinsuInfo,
    							FAC_EEE:etcChinsuInfo,
    							FAC_FFF:etcChinsuInfo,
    							FAC_GGG:etcChinsuInfo
    						};
    
    /** MVC 패턴 **/

    var setInitMap = function(){
		$('#mapMain').off('pageshow');
		
		Common.setPanelBtn();
		
		var content = $.mobile.getScreenHeight() - $("#mapMain .ui-header").outerHeight() - $("#mapMain .ui-footer").outerHeight();
		
        $("#mapMain .ui-content").height(content);
        $("#chinsuLayerScroll").height(content);
        $("#chinsuLayerScroll").height(content);
         
        $('#fdiscroll').height(content-150);
        $('[data-role="footer"]').hide();
        
        var chartWidth = $(window).width();
        var chartHeight = $.mobile.getScreenHeight();
        
        var ctop = parseInt((chartHeight/2)-(chartWidth/2));
        
        $('#csmChart').width(chartHeight);
        $('#csmChart').height(chartWidth);
        $('#csmChart').css('top', ctop+'px');
        $('#csmChart').css('left', '-'+ctop+'px');
        
        $('#csmChartDiv').width(chartWidth);
        
        $('#csmChartDiv').hide();
        
        $('#fidCloseBtn').on(Common.clickEventNm, function(){
        	$('#featurePanel').panel('close');
        });
        
        $('#fiCloseBtn').on(Common.clickEventNm, function(){
        	if(featureListIscroll != null){
        		featureListIscroll.destroy();	
        		featureListIscroll = null;
        	}
        	
        	$('#featureInfoDiv').hide();
        });
        
        $('#mapmainLocBtn').off(Common.clickEventNm).on(Common.clickEventNm,function(event){
			event.stopPropagation();
			event.preventDefault();
			if(locMode){
				locMode = false;
        		$(this).children().removeClass('ui-btn-active');
			}else{
				locMode = true;
        		$(this).children().addClass('ui-btn-active');
			}
			_TemplateMap.setGeoLocationVisible(locMode);
			if(currentMapType == 1){
				$('#mapmainDefBtn').children().addClass('ui-btn-active');
			}else{
				$('#mapmainAirBtn').children().addClass('ui-btn-active');
			}
			return false;
        });
        $('#mapmainDefBtn').off(Common.clickEventNm).on(Common.clickEventNm,function(event){
        	event.stopPropagation();
			event.preventDefault();
			currentMapType = 1;
			_TemplateMap.showDefautMap(); 
    		$(this).children().addClass('ui-btn-active');
    		$('#mapmainAirBtn').children().removeClass('ui-btn-active');
    		$('#bsmDiv').html('<img src="../../images/map/legend.png" style="width:170px ; height:95px; " >');
    		if(locMode){
        		$('#mapmainLocBtn').children().addClass('ui-btn-active');
			}
    		return false;
        });
        $('#mapmainAirBtn').off(Common.clickEventNm).on(Common.clickEventNm,function(event){
        	event.stopPropagation();
			event.preventDefault();
			currentMapType = 2;
			_TemplateMap.showAirMap();
    		$(this).children().addClass('ui-btn-active');
    		$('#mapmainDefBtn').children().removeClass('ui-btn-active');
    		$('#bsmDiv').html('<img src="../../images/map/legend_.png" style="width:170px ; height:95px; " >');
    		if(locMode){
        		$('#mapmainLocBtn').children().addClass('ui-btn-active');
			}
    		return false;
        });
        
		_TemplateMap.init('map');
		if(Common.shape == null){
			Common.shape = {type:'Point', coordinates:[126.978371,37.5666091]}
		}
		_TemplateMap.centerMap(Common.shape.coordinates[0],Common.shape.coordinates[1], 14);
		
		$mapMain.model.setMapEvent();
		
		$mapMain.model.drawMemoFeature();
		
		$mapMain.model.setCurrentWork();
	}
    
    // TODO View : HTML 엘리먼트 id 매핑
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
        
        // view 에 엘리먼트 등록
        
        /** Init View **/
        pub.init = function() {
        	
        };
        return pub;
    }());

    // TODO Model control function
    page.model = ( function() {
        // ////////////////////////////
        // private variables
        // ////////////////////////////
        
        // ////////////////////////////
        // public functions
        // ////////////////////////////
    	
    	
    	var parseCsmData = function(data){
    		csmObj.suv = [];
    		csmObj.sno = [];
    		csmObj.secno = [];
    		csmObj.crossec = [];
    		csmObj.fwl = [];
    		
			for(var i=0 ;i< data.length;i++){
				var item = data[i];
				var riverCd = item.riverCd;
				var crosssection = item.crosssection;
				
				if(item.shape != null && crosssection !='null'){
					csmObj.sno[i] = item.station;
					csmObj.suv[i] = [];
					csmObj.suv[i][0] = item.station;
					csmObj.suv[i][1] = JSON.parse(item.shape).coordinates;
					
					csmObj.secno[i] = riverCd.substring(0, 2)+item.station;
					csmObj.crossec[i] = crosssection;
					csmObj.fwl[i] = item.pFwl;
					
					csmObj[item.station] = i;
				}
			}
			csmObj.scnt = data.length;
    	}
    	
    	
    	var makeCql = function(features, fnm){
    		var cql = fnm +' IN (';
    		for(var i=0; i<features.length; i++){
    			
    			cql += "'"+features[i].get(CHINSU_KEYNM)+"'"+','; 
    		}
    		cql = cql.substring(0, cql.length-1)+')';
    		
    		return cql;
    	}
        var pub = {};
        
        pub.initParams = function(params){
        	PARAMS = params;
        	CURRENT_TYPE = params.type;
        };
        
        pub.setCurrentWork = function(){
        	
        	if(CURRENT_TYPE == null)
        		return;
        	
        	// 현재어떤지도 업무 인지 구분 
        	// 시설물 점용  관리구역 담당   친수  현장순찰 지도확인 등록
            // FAM   OPM  BSM    PCM   CSM   CHIN CMLOC         REG
        	 
        	if(CURRENT_TYPE == 'FAM'){
        		pub.getFamData();
        		
        		_TemplateMap.setMapHandleEndCallback(pub.setLayerOnfo);
        		
        		$('#featureTitle').html("시설물 상세 정보");
        		$('#mapmainSearchNm').keypress(function (e) {
        			if (e.which == 13) {
        				return false;    //<---- Add this line
        			}
        		});
        	}else if(CURRENT_TYPE == 'OPM'){
        		pub.getOpmData();
        		
        		_TemplateMap.setMapHandleEndCallback(pub.setLayerOnfo);
        		
        		$('#opmForm').show();
        		
        		$('#opmRegBtn').on(Common.clickEventNm, function(){
        			_TemplateMap.setFeatureRegMode(true,_SimbolRes.PIN.icon+'1'+_SimbolRes.PIN.type);
            		_TemplateMap.setCompleteCallback(function(feature){
            			var item = feature.get('item');
            			var coord = _TemplateMap.convertLonLatCoord(feature.getGeometry().getCoordinates(), false);
            			
            			Common.finish({type:'NP_REG', data:item, coord:coord});
            		});
        		});
        		
        		$('#featureTitle').html("점용/불법점용 상세 정보");
        	}else if(CURRENT_TYPE == 'BSM'){
        		pub.getBsmData();
        		$('#bsmDiv').show();
        		_TemplateMap.setMapClickCallback(null);
        	}else if(CURRENT_TYPE == 'PCM'){
        		pub.getPcmData();
        	}else if(CURRENT_TYPE == 'CSM'){
        		pub.getCsmData();    
        		
        		_TemplateMap.setMapHandleEndCallback(pub.setLayerOnfo);
        		
        		$('#csmChartDiv').show();
        	}else if(CURRENT_TYPE == 'CHIN'){
        		$('#chinsiForm').show();
        		$('#featureTitle').html("친수지구 상세정보");
        		
        		if(chinsuLayerIscroll != null){
            		chinsuLayerIscroll.refresh();
            	}else{
            		chinsuLayerIscroll = 	Common.createIscroll('#chinsuLayerScroll');	
            	}
        		pub.getChinsuData();
        		
        		_TemplateMap.setMapHandleEndCallback(pub.setLayerOnfo);
        		
        		_TemplateMap.setMapClickCallback(function(coord, features, featureRegMode){
        			var view = _TemplateMap.getMap().getView();
        			var viewResolution = view.getResolution();
        			
        			$mapMain.model.featureInfoListClear();
        			
        			var deferreds = [];
        			
        			var features = [];
        			
        			for(var i=0; i<chinsuLayer.length;i++){
        				if(chinsuLayer[i].getVisible()){
        					var source =  chinsuLayer[i].getSource();
                			var featureInfoUrl = source.getGetFeatureInfoUrl(coord, viewResolution, view.getProjection(), {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 100});
                			
                			if(featureInfoUrl){
                				deferreds.push($mapMain.model.getGetFeatureInfoUrl(featureInfoUrl));
                			}
        				}
         		   	}
        			var when = '$.when(';
	        		for(var z=0; z<deferreds.length;z++){
	        			when += 'deferreds['+z+'],';
	        		}
	        		when = when.substring(0, when.length-1)+').done($mapMain.model.setChinsuFeature);';
	        		eval(when);
        		});
        		
        	}else if(CURRENT_TYPE == 'CMLOC'){
        		Common.result(PARAMS.data);
//        		pub.getFamData();
        		pub.drawCmloc();
        	}else if(CURRENT_TYPE == 'SCLOC'){
        		Common.result(PARAMS.data);
//        		pub.getFamData();
        		pub.drawScloc();
        	}
        	else if(CURRENT_TYPE == 'NPLOC'){
        		Common.result(PARAMS.data);
//        		pub.getOpmData();
        		pub.drawNploc();
        	}else if(CURRENT_TYPE == 'SI_MODI'){
//        		pub.getFamData();
        		var coord = [];
        		coord[0] = PARAMS.data.xCoord;
        		coord[1] = PARAMS.data.yCoord;
        		
        		_TemplateMap.setFeatureRegMode(true,_SimbolRes.PIN.icon+'1'+_SimbolRes.PIN.type, coord);
        		_TemplateMap.setCompleteCallback(function(feature){
        			var item = feature.get('item');
        			var coord = _TemplateMap.convertLonLatCoord(feature.getGeometry().getCoordinates(), false);
        			
        			Common.finish({type:CURRENT_TYPE, data:item, coord:coord});
        		});
        	}else if(CURRENT_TYPE == 'UF_MODI'){
//        		pub.getFamData();
        		var coord = [];
        		coord[0] = PARAMS.data.xCoord;
        		coord[1] = PARAMS.data.yCoord;
        		
        		_TemplateMap.setFeatureRegMode(true,_SimbolRes.PIN.icon+'1'+_SimbolRes.PIN.type, coord);
        		_TemplateMap.setCompleteCallback(function(feature){
        			var item = feature.get('item');
        			var coord = _TemplateMap.convertLonLatCoord(feature.getGeometry().getCoordinates(), false);
        			
        			Common.finish({type:CURRENT_TYPE, data:item, coord:coord});
        		});
        	}else if(CURRENT_TYPE == 'REG'){
//        		pub.getFamData();
        		
        		_TemplateMap.setFeatureRegMode(true,_SimbolRes.PIN.icon+'1'+_SimbolRes.PIN.type);
        		_TemplateMap.setCompleteCallback(function(feature){
        			var item = feature.get('item');
        			var coord = _TemplateMap.convertLonLatCoord(feature.getGeometry().getCoordinates(), false);
        			
        			Common.finish({type:CURRENT_TYPE, data:item, coord:coord});
        		});
        	}else if(CURRENT_TYPE == 'FAC_MODI'){
        		pub.getFamData();
        		
        		_TemplateMap.setMapHandleEndCallback(pub.setLayerOnfo);
        		
        		_TemplateMap.setFeatureDragMode(true,'SI');
        		_TemplateMap.setCompleteCallback(function(feature){
        			var coord = _TemplateMap.convertLonLatCoord(feature.getGeometry().getCoordinates(), false);
        			
        			var item = feature.get('item');
        			item.type = CURRENT_TYPE;
        			item.xCoord = coord[0];
        			item.yCoord = coord[1];
        			
        			Common.finish(item);
        		});
        	}else if(CURRENT_TYPE == 'SC_MODI'){
//        		pub.getFamData();
        		var coord = [];
        		coord[0] = PARAMS.data.xCoord;
        		coord[1] = PARAMS.data.yCoord;
        		
        		_TemplateMap.setFeatureRegMode(true,_SimbolRes.PIN.icon+'1'+_SimbolRes.PIN.type, coord);
        		_TemplateMap.setCompleteCallback(function(feature){
        			var item = feature.get('item');
        			var coord = _TemplateMap.convertLonLatCoord(feature.getGeometry().getCoordinates(), false);
        			
        			Common.finish({type:CURRENT_TYPE, data:item, coord:coord});
        		});
        	}else if(CURRENT_TYPE == 'INS_MAP'){
        		_TemplateMap.setMapHandleEndCallback(pub.getInspectMapFeatures);
        		_TemplateMap.setMapClickCallback(function(coord, features, featureRegMode){
                	if(features == null || features.length <= 0){
                		return;
                	}
                	var fList = [];
                	for(var i=0; i<features.length; i++){
                		if(features[i].get('item').TAG == 'MEMO'){
                			fList.push(features[i]);
                		}
                	}
                	features = fList;
                	if(features.length > 1){
                		$mapMain.model.setFeatureList(features,function(){
            	    		var feature = featureInfoList[$(this).attr('idx')];
        	    			_TemplateMap.showPopup(feature,16, feature.get('item').TAG);	
                    		$('#fiCloseBtn').trigger(Common.clickEventNm);
                        });
                	}else {
                		var featureItem  = features[0].get('item');
                    	_TemplateMap.showPopup(features[0]);
                	}
        		});
        	}else if(CURRENT_TYPE == 'INS_LOC'){
        		_TemplateMap.setMapHandleEndCallback(pub.getInspectMapFeatures);
        		_TemplateMap.setMapClickCallback(function(coord, features, featureRegMode){
                	if(features == null || features.length <= 0){
                		return;
                	}
                	var fList = [];
                	for(var i=0; i<features.length; i++){
                		if(features[i].get('item').TAG == 'MEMO'){
                			fList.push(features[i]);
                		}
                	}
                	features = fList;
                	if(features.length > 1){
                		$mapMain.model.setFeatureList(features,function(){
            	    		var feature = featureInfoList[$(this).attr('idx')];
        	    			_TemplateMap.showPopup(feature,16, feature.get('item').TAG);	
                    		$('#fiCloseBtn').trigger(Common.clickEventNm);
                        });
                	}else {
                		var featureItem  = features[0].get('item');
                    	_TemplateMap.showPopup(features[0]);
                	}
        		});
        		PARAMS.data.wkt = PARAMS.data.tWKT;
        		PARAMS.data.keyNm = 'RiverName';
        		var routeFeatures = _KrimaLayer.createLineFeatures([PARAMS.data], 'ROUTE', '#28d735', true);
        		if(routeFeatures != null && routeFeatures.length > 0){
        			var coord = routeFeatures[0].getGeometry().getCoordinates();
        			var idx = parseInt(coord.length/2);
        			_TemplateMap.centerMap(coord[idx][0],coord[idx][1], 14);
        		}
				var routeLayer = _TemplateMap.addVectorLayer(routeFeatures);
        	}
        };
        
        pub.setLayerOnfo = function(layer){
        	var zoom = _TemplateMap.getZoom();
        	if(zoom > 13){
        		if(famLayer != null)
        			famLayer.setVisible(true);
        		if(opmLayer != null)
        			opmLayer.setVisible(true);
        		if(csmLayer != null)
        			csmLayer.setVisible(true);
        	    
        		if(chinsuLayer != null){
        			var layerOnfoFlag = $('#chinsuLayerList input[type=checkbox]');
            		for(var i=0; i<chinsuLayer.length; i++){
            			for(var j=0; j<layerOnfoFlag.length; j++){
            				var layerNm = $(layerOnfoFlag[j]).attr('name');
                  		    var chkyn = $(layerOnfoFlag[j]).is(':checked');
                  		   
            				if(chinsuLayer[i].get('layerNm') == layerNm){
              				   chinsuLayer[i].setVisible(chkyn);
              			   }
            			}
            		}	
        		}
        	}else{
        		if(famLayer != null)
        			famLayer.setVisible(false);
        		if(opmLayer != null)
        			opmLayer.setVisible(false);
        		if(csmLayer != null)
        			csmLayer.setVisible(false);
        		if(chinsuLayer != null){
	        		for(var i=0; i<chinsuLayer.length; i++){
	  				   chinsuLayer[i].setVisible(false);
	        		}
        		}
        	}
        };
        
        pub.getInspectMapFeatures = function(map){
        	var zoom = _TemplateMap.getZoom();
        	
        	if(inspectLayer != null){
    			_TemplateMap.removeLayer(inspectLayer);
    			inspectLayer = null;
    		}
        	
        	// 시설물 불러오기
        	if(zoom > 13){
        		var bound = _TemplateMap.getMapBounds('EPSG:900913');
            	var uri = '/api/common/GetDrawFacList';
            	var param = {};
            	param.key = Common.inspectLoginKey;
            	param.facCodes='10,20,30,40';
            	param.bound = bound.toString();
            	
        		Common.egovHyb.get(uri,"json",param,function(winparm){
    				
        			var features = {};
        			if(typeof(winparm) == 'string') {
        				if(Common.isIOS){
            				winparm = winparm.replace(/"/gi, '');
            				winparm = winparm.replace(/&1;/gi, '"');
            			}
        				winparm = JSON.parse(winparm);
        			}
        				
        			for(var i=0; i<winparm.length; i++){
        				var feature = winparm[i];
        				if(features[feature.facCode] == null)
        					features[feature.facCode] = [];
        				features[feature.facCode].push(feature);
        			}
    				
    				var gateFeatures = _KrimaLayer.createPointFeatures(features['30'], 'GATE','GATE',null, true);
    				var pipeFeatures = _KrimaLayer.createPointFeatures(features['40'], 'PIPE','PIPE',null, true);
    				var leveeFeatures = _KrimaLayer.createLineFeatures(features['10'], 'LEVEE', '#ff7f27', true);
    				var damFeatures = _KrimaLayer.createPolygonFeatures(features['20'], 'DAM', '#99822c', '#99822c', true);
    				var features = gateFeatures.concat(pipeFeatures).concat(leveeFeatures).concat(damFeatures);
    				
    				inspectLayer = _TemplateMap.addVectorLayer(features);
    			});
        	}
        }
        pub.getGetFeatureInfoUrl = function(featureInfoUrl){
        	var defrred = $.Deferred();
        	
        	$.getJSON(featureInfoUrl, function(response){
        		
			   	var parser = new ol.format.GeoJSON();
			   
			   	var feature = parser.readFeatures(response);
			   	
			   	for(var j=0; j<feature.length; j++){
			   		var tag = feature[j].getId().split('.')[0];
			   		
			   		var item = feature[j].getProperties();
			   		
			   		var labelKey ='fac_name';
			   		var fac_keyNm = CHINSU_KEYNM;
			   		
			   		if(tag == 'C162'){
	        			labelKey = 'waf_name';
	        		}else if(tag == 'FAC_A001'){
	        			labelKey = 'tre_nam';
	        		}else if(tag == 'FAC_A002'){
	        			labelKey = 'shr_nam';
	        		}
			   		
			   		item.keyNm = labelKey;
			   		item.TAG = tag;
			   		item.fac_ind = pub.getFacInd(item[fac_keyNm]);
			   		feature[j].set('item', item);
			   		
			   	}
			   	defrred.resolve(feature);
			});
			return defrred;
        }
        pub.setChinsuFeature = function(){
        	
        	var features =[];
        	for(var i=0; i<arguments.length; i++){
        		if(arguments[i].length >0){
        			features = features.concat(arguments[i]);
        		}
        	}
        	
        	if(features.length == 1){
    			_TemplateMap.showPopup(features[0],null, features[0].get('TAG'));
        	} else if(features.length > 1){
        		$mapMain.model.setFeatureList(features, function(){
    		   		var feature = featureInfoList[$(this).attr('idx')];
        			_TemplateMap.showPopup(feature,null, feature.get('TAG'));	
    		   	});	
        	}
        }
        
        pub.drawMemoFeature = function(){
        	var param = {type:"getALL"};
        	
        	if(memoLayer != null)
        		_TemplateMap.removeLayer(memoLayer);
        	Common.memoPipe(param,function(result){
        		if(result.code == '1'){
        			var feature = _KrimaLayer.createPointFeatures(result.data, 'MEMO','MEMO');
        			memoLayer = _TemplateMap.addVectorLayer(feature);
        		}
        	});
        }
        
        pub.putMemo = function(){
        	
        	var param = {type:"put"};
        	param.title = $('#memoTitle').val();
        	param.content = $('#memoContent').val();
        	param.address = $('#memoAddress').val();
        	param.x_coord = $('#memox').val();
        	param.y_coord = $('#memoy').val();
        	
        	Common.memoPipe(param, function(result){
        		pub.drawMemoFeature();
        	});
        }
        pub.deleteMemo = function(idx){
        	var param = {type:"delete", idx:idx};
        	
        	Common.memoPipe(param, function(){
        		pub.drawMemoFeature();
        	});
        }
        pub.updateMemo = function(idx){
        	var param = {type:"update"};
        	
        	param.idx = idx;
        	param.title = $('#memoTitle').val();
        	param.content = $('#memoContent').val();
        	param.address = $('#memoAddress').val();
        	param.x_coord = $('#memox').val();
        	param.y_coord = $('#memoy').val();
        	
        	Common.memoPipe(param, function(){
        		pub.drawMemoFeature();
        	});
        }
        
        pub.getFacInd = function(fac_key){
        	if(chinFeatures == null)
        		return '';
        	
        	for(var i=0; i<chinFeatures.length; i++){
        		if(chinFeatures[i].get(CHINSU_KEYNM) == fac_key){
        			return chinFeatures[i].get('fac_ind');
        		}
        	}
        }
        pub.searchFam = function(){
        	var snm = $('#mapmainSearchNm').val();
        	if(snm.length <= 0)
        		return;
        	
        	if(famLayer == null)
        		return;
        	
        	var features = famLayer.getSource().getFeatures();
        	
        	var resultFeatures = [] ;
        	
        	for(var i=0;i<features.length;i++){
        		var feature = features[i];
        		var item = feature.get('item');
        		if(item == null)
        			continue;
        		
        		if(item.sisulNm.indexOf(snm) > -1){
        			resultFeatures.push(feature);
        		}
        	}
        	$mapMain.model.setFeatureList(resultFeatures, function(){
	    		var feature = featureInfoList[$(this).attr('idx')];
    			_TemplateMap.showPopup(feature,16, feature.get('item').TAG);	
            });
        }
        // 현장순찰 위치
        pub.drawCmloc = function(){
        	var feature = _KrimaLayer.createPointFeatures([PARAMS.data], 'CMLOC','PIN');
        	
        	cmlocLayer = _TemplateMap.addVectorLayer(feature);
        	_TemplateMap.showPopup(feature[0], 14);
        }
        // 점용 위치
        pub.drawNploc = function(){
        	var feature = _KrimaLayer.createPointFeatures([PARAMS.data], 'NPLOC','PIN');
        	
        	cmlocLayer = _TemplateMap.addVectorLayer(feature);
        	_TemplateMap.showPopup(feature[0], 14);
        }
     // 공사구간 위치
        pub.drawScloc = function(){
        	var feature = _KrimaLayer.createPointFeatures([PARAMS.data], 'SCLOC','PIN');
        	
        	cmlocLayer = _TemplateMap.addVectorLayer(feature);
        	_TemplateMap.showPopup(feature[0] , 14);
        }
        
        // 시설물 조회
    	pub.getFamData = function(){
    		if(famLayer != null)
    			pub.clearFamData();
    		
    		$('#facSearchForm').show();
    		
    		$('#mapmainSearchBtn').off(Common.clickEventNm).on(Common.clickEventNm, function(){
            	$mapMain.model.searchFam();
            });
    		var data ={
    				"rtnType":"all",
    				"gcmId": Common.GCMID
    			};
			var uri = "/mob/fam/famJsonList.do";
			
			Common.showLoadingBar();
			
			Common.egovHyb.post(uri,"json",data,function(winparm){
				Common.hideLoadingBar();
				
				var rtn = JSON.parse(winparm);
				
				var listFeatures = _KrimaLayer.createPointFeatures(rtn.list, 'SI',null,true);
				var jlistFeatures = _KrimaLayer.createPointFeatures(rtn.jlist, 'SI','Jlist',true);
				var blistFeatures = _KrimaLayer.createPointFeatures(rtn.blist, 'ROAD','Blist',true);
				
				famLayer = _TemplateMap.addVectorLayer(listFeatures.concat(jlistFeatures).concat(blistFeatures));
				
			}, function(err){
				Common.hideLoadingBar();
			});
    	};
    	pub.clearFamData = function(){
    		
    		if(famLayer != null){
    			_TemplateMap.removeLayer(famLayer);
    			famLayer = null;
    		}
    	};
    	//  측점및횡단면조회
    	pub.getCsmData = function(){
    		var data ={
    				"rtnType":"all",
    				"userId":Common.loginId,
    				"gcmId": Common.GCMID
    			};
			var uri = "/mob/fam/csmJsonList.do";
			
			Common.showLoadingBar();
			
			Common.egovHyb.post(uri,"json",data,function(winparm){
				Common.hideLoadingBar();
				
				var rtn = JSON.parse(winparm);
				
				parseCsmData(rtn.clist)
				
				var csmFeatures = _KrimaLayer.createCSMFeature(csmObj.suv, 'CSM');
				csmLayer = _TemplateMap.addVectorLayer(csmFeatures);
				
			}, function(err){
				Common.hideLoadingBar();
			});
    	};
    	
    	// 측단면 레이어 삭제 
    	pub.clearCsmData = function(){
    		if(csmLayer != null){
    			_TemplateMap.removeLayer(csmLayer);
    			csmLayer = null;
    			csmObj = {};
    		}
    	}
    	
    //  친수지구 레이어
    	pub.getChinsuData = function(){
    		var fillterNm = 'sub_code=';
    		var fillterVal = Common.mgrCd;
    		
    		if(Common.mgrLvl == '1') {
    			fillterNm = '1=';
    			fillterVal = '1';
    		}else if(Common.mgrLvl == '2'){
    			fillterNm = 'mag_code='
    		}
    	
    		var layer = _KrimaLayer.getTbC162Features(fillterNm, fillterVal , function(result){
    			
    			chinFeatures = result;
    			var cql = makeCql(result, CHINSU_KEYNM);
    			
    			var layerInfos = [];
    			layerInfos.push({layerNm:'C162',isVisible:true,isTiled:true,cql:fillterNm+fillterVal});
    			layerInfos.push({layerNm:'FAC_A001',isVisible:false,isTiled:true,cql:cql});
    			layerInfos.push({layerNm:'FAC_A002',isVisible:false,isTiled:true,cql:cql});
    			layerInfos.push({layerNm:'FAC_AAA',isVisible:false,isTiled:true,cql:cql});
    			layerInfos.push({layerNm:'FAC_BBB',isVisible:false,isTiled:true,cql:cql});
    			layerInfos.push({layerNm:'FAC_CCC',isVisible:false,isTiled:true,cql:cql});
    			layerInfos.push({layerNm:'FAC_DDD',isVisible:false,isTiled:true,cql:cql});
    			layerInfos.push({layerNm:'FAC_EEE',isVisible:false,isTiled:true,cql:cql});
    			layerInfos.push({layerNm:'FAC_FFF',isVisible:false,isTiled:true,cql:cql});
    			layerInfos.push({layerNm:'FAC_GGG',isVisible:false,isTiled:true,cql:cql});
    			
    			chinsuLayer = _KrimaLayer.createTileLayer(layerInfos);
    			
        		for(var i=0;i<chinsuLayer.length;i++){
        			_TemplateMap.addLayer(chinsuLayer[i]);	
        		}
        		layer.setVisible(false);
    		}); 
    		_TemplateMap.addLayer(layer);
    	};
    	
    	//친수지구 삭제 
    	pub.clearChinsuData = function(){
    		if(chinsuLayer != null){
    			for(var i=0;i<chinsuLayer.length;i++){
        			_TemplateMap.removeLayer(chinsuLayer[i]);	
        		}
    			chinsuLayer = null;
    		}
    	}
    	
    	//점용 조회 
    	pub.getOpmData = function(){
    		if(opmLayer != null){
    			pub.clearOpmData();
    		}
    		
    		var data ={
    				"rtnType":"all",
    				"gcmId": Common.GCMID
    			};
			var uri = "/mob/opm/opmMapJsonList.do";
			Common.showLoadingBar();
			
			Common.egovHyb.post(uri,"json",data,function(winparm){
				Common.hideLoadingBar();
				
				var rtn = JSON.parse(winparm);
				
				var listFeatures = _KrimaLayer.createPointFeatures(rtn.list, 'OPM', 'Plist', true );
				
				var jlistFeatures = _KrimaLayer.createPointFeatures(rtn.nplist, 'OPM','Ilist', true);
				
				opmLayer = _TemplateMap.addVectorLayer(listFeatures.concat(jlistFeatures));
				
			}, function(err){
				Common.hideLoadingBar();
			});
    	}
    	//점용 조회 
    	pub.clearOpmData = function(){
    		if(opmLayer != null){
    			_TemplateMap.removeLayer(opmLayer);
    			opmLayer = null;
    		}
    	}
    	
    	//관리구역 조회 
    	pub.getBsmData = function(){
    		
    		if(opmLayer != null){
    			pub.clearOpmData();
    		}
    		
    		var data ={
    				"rtnType":"all",
    				"gcmId": Common.GCMID,
    				"userId": Common.loginId
    			};
			var uri = "/mob/fam/bsmJsonList.do";
			Common.showLoadingBar();
			
			Common.egovHyb.post(uri,"json",data,function(winparm){
				Common.hideLoadingBar();
				
				var rtn = JSON.parse(winparm);
				var listFeatures = _KrimaLayer.createLineFeatures(rtn.bulist, 'BSM', '#ffff00');
				bsmLayer = _TemplateMap.addVectorLayer(listFeatures);
				
			}, function(err){
				Common.hideLoadingBar();
			});
    	}
    	//관리구역 조회 
    	pub.clearBsmData = function(){
    		if(bsmLayer != null){
    			_TemplateMap.removeLayer(bsmLayer);
    			bsmLayer = null;
    		}
    	}
    	//담당업무구역 조회 
    	pub.getPcmData = function(){
    		
    		if(opmLayer != null){
    			pub.clearOpmData();
    		}
    		
    		var data ={
    				"rtnType":"all",
    				"gcmId": Common.GCMID,
    				"userId": Common.loginId
    			};
			var uri = "/mob/pcm/pcmJsonList.do";
			Common.showLoadingBar();
			
			Common.egovHyb.post(uri,"json",data,function(winparm){
				Common.hideLoadingBar();
				
				var rtn = JSON.parse(winparm);
				var listFeatures = _KrimaLayer.createLineFeatures(rtn.list, 'PCM', '#ff0000');
				pcmLayer = _TemplateMap.addVectorLayer(listFeatures);
				
			}, function(err){
				Common.hideLoadingBar();
			});
    	}
    	//담당업무구역 조회 
    	pub.clearPcmData = function(){
    		if(pcmLayer != null){
    			_TemplateMap.removeLayer(pcmLayer);
    			pcmLayer = null;
    		}
    	}
    	
    	pub.setFeatureList = function(features, itemClickCallback){
    		if(features == null || features.length <= 0) {
    			$('#featureInfoList').html('');
            	$("#featureInfoList").listview("refresh"); 
            	return;
    		}
        	
        	if(featureInfoList == null)
        		featureInfoList = [];
        	
    		featureInfoList = features;
        	
        	var prefix = '';
        	var html = '';
        	
        	for(var i=0;i<featureInfoList.length;i++){
        		var feature = featureInfoList[i];
        		var featureItem  = feature.get('item');
        		var tag = feature.get('TAG');
        		
        		var labelKey;
        		
        		if(featureItem.TAG == 'SI'|| featureItem.TAG == 'ROAD')
        			labelKey = 'sisulNm';
        		else if(featureItem.TAG == 'OPM')
        			labelKey = 'idx';
        		else if(featureItem.TAG == 'CSM'){
        			prefix = 'No.';
        			labelKey = 0;
        		}
        		if(labelKey != null){
        			featureItem.keyNm = labelKey;
        		}
        		html +='<li data-icon="false" class="finfo" idx="'+i+'"><a href="javascript:void(0);"><span style="font-size:12px">'+prefix+featureItem[featureItem.keyNm]+'</span></a></li>';
        	}
        	$('#featureInfoList').html(html);
        	$("#featureInfoList").listview("refresh"); 
        	
        	$('#featureInfoDiv').show();
        	
        	if(featureListIscroll != null){
        		featureListIscroll.refresh();
        	}else{
        		featureListIscroll = Common.createIscroll('#fiscroll');	
        	}
        	$('.finfo').on(Common.clickEventNm, itemClickCallback );
        }
    	pub.featureInfoListClear = function(){
    		featureInfoList = null;
    		
    		$('#featureInfoList').html('');
    		$("#featureInfoList").listview("refresh"); 
    		if(featureListIscroll != null)
        		featureListIscroll.destroy();
    	}
    	// Ajax 콜백 처리
    	pub.searchCallBack = function(result){
    		
    	};
    	
    	pub.getSTNOfromSNV = function(x,y) {
    		var cx = 0;
    		var cy = 0;
    		var dx = 0;
    		var dy = 0;
    		var minL = 10000;
    		var min = 0;
    		var minidx = 0; //

    		if(csmObj == null || csmObj.scnt == null){
    			return -1;
    		}
			for (var i = 0; i < csmObj.scnt; i++) {
				cx = ((parseFloat(csmObj.suv[i][1]) + parseFloat(csmObj.suv[i][3])) / 2.0);
				cy = ((parseFloat(csmObj.suv[i][2]) + parseFloat(csmObj.suv[i][4])) / 2.0);
				dx = (x - cx);
				dy = (y - cy);
				min = dx * dx + dy * dy;
				if (minL > min) {
					minL = min;
					minidx = i;
				}
			}
    		return minidx;
    	}
        
        pub.drawCsmChart = function(div, isFull){
//        	$('#gisMenu').hide();
        	
        	var closeBtn = {};
        	
        	var chartOption = {};
        	
        	var idx = csmObj[csmCurrentFeature[0]];
    		var crossec =  csmObj.crossec[idx].split(',');
    		var fwl =  csmObj.fwl[idx];
    		var crossecChartData = [];
    		var highData = [];
    		var rowData = [];
    		var fwlData = [];
    		var deepMax = 0.0;
    		var deepMin = 500.0;
    		
    		for(var i=0; i<crossec.length; i=i+2){
    			var deep = parseInt(crossec[i+1]);
    			if(deepMax < deep){
    				deepMax = deep;
    			}
    			if(deepMin > deep){
    				deepMin = deep;
    			}
    			crossecChartData.push([parseInt(crossec[i]), parseInt(crossec[i+1])]);
    		}
    		// 최고점
    		highData[0] = [crossecChartData[0][0], deepMax];
    		highData[1] = [crossecChartData[crossecChartData.length-1][0], deepMax];
    		
    		// 최저점
    		rowData[0] = [crossecChartData[0][0], deepMin];
    		rowData[1] = [crossecChartData[crossecChartData.length-1][0], deepMin];
    		
    		// 홍수선
    		fwlData[0] = [crossecChartData[0][0], parseInt(fwl)];
    		fwlData[1] = [crossecChartData[crossecChartData.length-1][0], parseInt(fwl)];
    		
    		var chartData;
    		
    		if(isFull){
        		closeBtn = {
   		                    text: 'X',
   		                    _titleKey: '',
   		                    onclick: function() {
   		                    	$("#csmPanel").panel("close");
   		                    }
   		                }
    			chartData = [{
       	            name: '위',
       	            data: highData,
       	            zIndex: 1,
       	            color: '#000000',
       	            lineWidth: 1
       	        },{
       	            name: '아래',
       	            data: rowData,
       	            zIndex: 1,
       	            color: '#000000',
       	            lineWidth: 1
       	        },{
       	            name: '홍수',
       	            data: fwlData,
       	            zIndex: 1,
       	            color: '#ff0000',
       	            lineWidth: 1
       	        }, {
               	            name: '단면',
               	            data: crossecChartData,
               	            type: 'area',
               	            lineWidth: 1,
               	            color: Highcharts.getOptions().colors[1],
               	            fillOpacity: 0.5,
               	            zIndex: 0
       	        }]
        	
        		$('#csmPanel').panel('open');
        		
    		}else{
    			chartOption = { events:{ click:function(){ $mapMain.model.drawCsmChart('csmChart', true ); },} }
    			chartData = [{
       	            name: '단면',
       	            data: crossecChartData,
       	            type: 'area',
       	            lineWidth: 1,
       	            color: Highcharts.getOptions().colors[1],
       	            fillOpacity: 0.5,
       	            zIndex: 0
       	        }];
    		}
        	$('#'+div).highcharts({
        		chart:chartOption,
        		exporting: {
   		            buttons: {
   		                contextButton: { enabled: false },
   		                customButton: closeBtn
   		            }
       		    },
       		    legend:{enabled:false},
       	        title: {
       	            text: isFull ? 'No.'+csmCurrentFeature[0]: ''
       	        },
       	        xAxis: {
       	            allowDecimals: false,
       	            labels: {
       	            	enabled:isFull,
       	                formatter: function () {
       	                    return this.value; // clean, unformatted number for year
       	                }
       	            }
       	        },
       	        yAxis: {
       	            title: {
       	                text: ''
       	            },
       	            labels: {
       	            	enabled:isFull,
       	                formatter: function () {
       	                    return this.value;
       	                }
       	            }
       	        },
       	        plotOptions: {
       	        	series:{
       	        		allowPointSelect: false,
       	        		 marker: {
       	                     enabled: false
       	                 }
       	        	},
       	            area: {
       	                pointStart: 0.0,
       	                marker: {
       	                    enabled: false,
       	                    symbol: 'circle',
       	                    radius: 2,
       	                    states: {
       	                        hover: {
       	                            enabled: false
       	                        }
       	                    }
       	                }
       	            }
       	        },
       	        tooltip: {
       	        	enabled: false,
       	            pointFormat: ''
       	        },
       	        series: chartData
       	    });
        }
        pub.checkShow = function(info, item){
        	if(info == null)
        		return false;
        	
    		if(info.where != null){
    			var whereKey = info.where.split(':');
    			
    			if(whereKey[1].indexOf('not') >-1) {
    				var wvals = pub.getWValue(whereKey[1]);
    				var flag = true;
    				
    				for(var i=0;i<wvals.length;i++){
    					if(item[whereKey[0]] == wvals[i])
    						flag = false;
    				}
    				return flag;
    			} else if(whereKey[1].indexOf('lk') >-1){
    				var wvals = pub.getWValue(whereKey[1]);
    				var flag = false;
    				for(var i=0;i<wvals.length;i++){
    					if(item[whereKey[0]].indexOf(wvals[i]) > -1)
    						flag = true;
    				}
    				return flag;
    			}else if(whereKey[1].indexOf('nl') >-1){
    				var wvals = pub.getWValue(whereKey[1]);
    				var flag = true;
    				
    				for(var i=0;i<wvals.length;i++){
    					if(item[whereKey[0]].indexOf(wvals[i]) > -1)
    						flag = false;
    				}
    				return flag;
    			}else{
    				var wvals = whereKey[1].split(',');
    				for(var i=0;i<wvals.length;i++){
    					if(item[whereKey[0]] == wvals[i])
    						return true;
    				}
    			}
    		}else{
    			return true;
    		}
        }
        
        pub.getWValue = function(val){
        	return val.substring(val.indexOf('(')+1,val.indexOf(')')).split(',');
        }
        pub.setMemoWork = function(item){
    		$('#memoTitle').val(item.title);
    		$('#memoContent').val(item.content);
    		$('#memoAddress').val(item.address);
    		$('#memox').val(item.x_coord);
    		$('#memoy').val(item.y_coord);
    		
    		$('#memoRegDiv').hide();
 		    $('#memoViewDiv').show();
 		    
 		    $('#memoPanel').panel('open');
		   
 		    $('#memoUpBtn').off(Common.clickEventNm).on(Common.clickEventNm, function(){
 		    	$mapMain.model.updateMemo(item.idx);
			   	_TemplateMap.clearPopup();
			   	$('#memoPanel').panel('close');
 		    });
 		    $('#memoDelBtn').off(Common.clickEventNm).on(Common.clickEventNm, function(){
 		    	$mapMain.model.deleteMemo(item.idx);
 		    	_TemplateMap.clearPopup();
 		    	$('#memoPanel').panel('close');
 		    });
 		    $('#memoCloBtn').off(Common.clickEventNm).on(Common.clickEventNm, function(){
 		    	$('#memoPanel').panel('close');
 		    });
        }
        pub.setMapEvent = function(){
        	_TemplateMap.setFeatureInfoCallback(function(feature){
            	if(feature == null)
            		return;
            	var item = feature.get('item');
            	
            	if(item.TAG == 'MEMO'){
            		pub.setMemoWork(item);
         		    return;
            	}
            	var infos = featureDetailInfo[item.TAG];
            	
            	if(infos == null)
            		return;
            	
            	var html = '';
            	
            	for(var i=0; i<infos.length; i++){
            		var info = infos[i];
            		
            		if(!pub.checkShow(info, item))
            			continue;
            		
            		var value = info.key.split(',');
            		
            		var val = '';
            		
            		var suffix = info.suffix == null ? '' : info.suffix;
            		
            		for(var j=0; j<value.length;j++){
            			if(j<value.length-1)
            				val += item[value[j]]+suffix;
            			else
            				val += item[value[j]];
            		}
            		val = (val == null || val =='null') ? '':val;
            		html +='<li><span>● '+info.title+' : </span><span>'+val+'</span></li>';
            		
            	}
            	if((item.TAG == 'SI' || item.TAG == 'ROAD') && item.fileCnt > 0){
        			var data ={
	            				"serchIdx":item.idx,
	            				"gcmId": Common.GCMID
	            				};
        			var uri = "/mob/fam/ffJsonList.do";
        			
        			$.mobile.loading('show');
        			Common.egovHyb.post(uri,"json",data,function(winparm){
        				$.mobile.loading('hide');
        				
        				var rtn = JSON.parse(winparm);
        				if(rtn != null && rtn.flist != null && rtn.flist.length > 0){
        					var fhtml = '';
            				for(var i=0; i< rtn.flist.length;i++){
            					var file = rtn.flist[i];
            					var imgUrl = Common.serverUrl +'/mob/fam/view.do?imgNm='+file.fileNm
            					fhtml += '<li><img src="'+imgUrl+'" ></li>';
            				}
            				$('#featureDetailList').append(fhtml);
            				$("#featureDetailList").listview("refresh"); 
            				
            				if(featureInfoIscroll != null)
            					featureInfoIscroll.refresh();
        				}
        			}, function(err){
        				$.mobile.loading('hide');
        			});
            	}
            	// 테스트
            	$('#featureDetailList').html(html);
            	$("#featureDetailList").listview("refresh"); 
            	
            	$('#featurePanel').panel('open');
            	
            	if(featureInfoIscroll != null){
            		featureInfoIscroll.refresh();
            	}else{
            		featureInfoIscroll = 	Common.createIscroll('#fdiscroll');	
            	}
    		});
            
            _TemplateMap.setMapClickCallback(function(coord, features, featureRegMode){
            	
            	if(PARAMS != null && PARAMS.type == 'CSM'){
            		if(features == null ||features.length <= 0){
                		features = [];
                		
                		var stno = $mapMain.model.getSTNOfromSNV(coord[0],coord[1]);
                		if(stno == -1)
                			return;
                		
                		var csmItem = csmObj.suv[stno];
                		csmItem.TAG = 'CSM';
                		
                		var f = new ol.Feature({
    	      				  geometry: new ol.geom.Point(coord),
    	      				  item: csmItem,
    	      				  name: 'No.'+csmItem[0]
    	      			});
                		features.push(f);
            		}
            	}
            	
            	if(features == null || features.length <= 0){
            		return;
            	}
            	if(features.length > 1){
            		$mapMain.model.setFeatureList(features,function(){
        	    		var feature = featureInfoList[$(this).attr('idx')];
        	    		if(feature.get('item').TAG == 'CSM'){
        	    			$('#csmChartDiv').show();
                    		csmCurrentFeature = feature.get('item');
                    		$mapMain.model.drawCsmChart('csmChartDiv', false);
        	    		}else{
        	    			_TemplateMap.showPopup(feature,16, feature.get('item').TAG);	
        	    		}
                		$('#fiCloseBtn').trigger(Common.clickEventNm);
                    });
            	}else {
            		var featureItem  = features[0].get('item');
                	
                	if(featureItem.TAG == 'CSM'){
                		csmCurrentFeature = featureItem;
                		$mapMain.model.drawCsmChart('csmChartDiv', false);
                		return;
                	}
                	_TemplateMap.showPopup(features[0]);
            	}
    		});
        }
        // Init Model
        pub.init = function() {
        };
        return pub;
    }());
    
    // TODO Controller event binding
    page.controller = ( function() {
        // ////////////////////////////
        // private variables
        // ////////////////////////////

        // ////////////////////////////
        // private functions
        // ////////////////////////////
    	
    	var createFeatureCallback = function(feature){
    	}
        // ////////////////////////////
        // public functions
        // ////////////////////////////
        var pub = {};
        
        // Init Controller
        pub.init = function() {
            // Init Model, View
            page.model.init();
            page.view.init();
            // ///////////////////
            // Event Handler
            // ///////////////////
            
            $('#mapmainRegBtn').on(Common.clickEventNm,function(){
            	if($(this).attr('class').indexOf('krimaMapBtnOff') > -1){
            		_TemplateMap.setFeatureRegMode(true,_SimbolRes.PIN.icon+'1'+_SimbolRes.PIN.type);
            		_TemplateMap.setCompleteCallback(function(feature){
            			var item = feature.get('item');
            			var coord = _TemplateMap.convertLonLatCoord(feature.getGeometry().getCoordinates(), false);
            			
            		});
            		$(this).removeClass('krimaMapBtnOff');
            		$(this).addClass('krimaMapBtnOn');
            	}else{
            		_TemplateMap.setFeatureRegMode(false);
            		_TemplateMap.setCompleteCallback(null);
            		
            		$(this).removeClass('krimaMapBtnOn');
            		$(this).addClass('krimaMapBtnOff');
            	}
            });
            
            $('#mapmainMoveBtn').on(Common.clickEventNm,function(){
            	
            	if($(this).attr('class').indexOf('krimaMapBtnOff') > -1){
            		_TemplateMap.setFeatureDragMode(true,'SI');
            		_TemplateMap.setCompleteCallback(function(feature){
            			var coord = _TemplateMap.convertLonLatCoord(feature.getGeometry().getCoordinates(), false);
            			
            		});
            		$(this).removeClass('krimaMapBtnOff');
            		$(this).addClass('krimaMapBtnOn');
            	}else{
            		_TemplateMap.setFeatureDragMode(false);
            		_TemplateMap.setCompleteCallback(null);
            		$(this).removeClass('krimaMapBtnOn');
            		$(this).addClass('krimaMapBtnOff');
            	}
            	
            });
 
            // 시설물 업무
            $('#mapmainBtn1').on(Common.clickEventNm,function(){
            	if($(this).attr('class').indexOf('krimaMapBtnOff') > -1){
            		
            		$mapMain.model.getFamData();
            		
            		$(this).removeClass('krimaMapBtnOff');
            		$(this).addClass('krimaMapBtnOn');
            		
            	}else{
            		$mapMain.model.clearFamData();
            		
            		$(this).removeClass('krimaMapBtnOn');
            		$(this).addClass('krimaMapBtnOff');
            	}
            });
            // 점용 업무
            $('#mapmainBtn2').on(Common.clickEventNm,function(){
            	if($(this).attr('class').indexOf('krimaMapBtnOff') > -1){
            		
            		$mapMain.model.getOpmData();
            		
            		$(this).removeClass('krimaMapBtnOff');
            		$(this).addClass('krimaMapBtnOn');
            		
            	}else{
            		$mapMain.model.clearOpmData();
            		
            		$(this).removeClass('krimaMapBtnOn');
            		$(this).addClass('krimaMapBtnOff');
            	}
            });
            // 관리구역 업무
            $('#mapmainBtn3').on(Common.clickEventNm,function(){
            	if($(this).attr('class').indexOf('krimaMapBtnOff') > -1){
            		$mapMain.model.getBsmData();
            		
            		$(this).removeClass('krimaMapBtnOff');
            		$(this).addClass('krimaMapBtnOn');
            		$('#bsmDiv').show();
            	}else{
            		$mapMain.model.clearBsmData();
            		
            		$(this).removeClass('krimaMapBtnOn');
            		$(this).addClass('krimaMapBtnOff');
            		$('#bsmDiv').hide();
            	}
            });
            
         // 담당업무구역
            $('#mapmainBtn4').on(Common.clickEventNm,function(){
            	if($(this).attr('class').indexOf('krimaMapBtnOff') > -1){
            		$mapMain.model.getPcmData();
            		
            		$(this).removeClass('krimaMapBtnOff');
            		$(this).addClass('krimaMapBtnOn');
            	}else{
            		$mapMain.model.clearPcmData();
            		
            		$(this).removeClass('krimaMapBtnOn');
            		$(this).addClass('krimaMapBtnOff');
            	}
            });
            

            // 측점 단면 조회
           $('#mapmainBtn5').on(Common.clickEventNm,function(){
	           	if($(this).attr('class').indexOf('krimaMapBtnOff') > -1){
	           		$mapMain.model.getCsmData();
	           		
	           		$(this).removeClass('krimaMapBtnOff');
	           		$(this).addClass('krimaMapBtnOn');
	           	}else{
	           		$mapMain.model.clearCsmData();
	           		
	           		$(this).removeClass('krimaMapBtnOn');
	           		$(this).addClass('krimaMapBtnOff');
	           	}
           });
           
           // 친수지구
           $('#mapmainBtn6').on(Common.clickEventNm,function(){
	           	if($(this).attr('class').indexOf('krimaMapBtnOff') > -1){
	           		$mapMain.model.getChinsuData();
	           		
	           		$(this).removeClass('krimaMapBtnOff');
	           		$(this).addClass('krimaMapBtnOn');
	           	}else{
	           		$mapMain.model.clearChinsuData();
	           		
	           		$(this).removeClass('krimaMapBtnOn');
	           		$(this).addClass('krimaMapBtnOff');
	           	}
           });
           // 친수지구
           $('#mapmainBtn7').on(Common.clickEventNm,function(){
        	   $('#chinsuPanel').panel('open');
        	   
        	   $('#chinsuLayerList input[type=checkbox]').off(Common.clickEventNm).on(Common.clickEventNm, function(evt){
        		   var layerNm = $(this).attr('name');
        		   var chkyn = $(this).is(':checked');
        		   
        		   for(var i=0; i<chinsuLayer.length;i++){
        			   
        			   if(chinsuLayer[i].get('layerNm') == layerNm){
        				   chinsuLayer[i].setVisible(chkyn);
        				   break;
        			   }
        		   }
        	   });
           });
           
           // 메모
           $('#mapmainBtn8').on(Common.clickEventNm,function(){
        	   
        	   if(memoMapState == null)
        		   memoMapState = _TemplateMap.getFeatureRegModeState();
        	   
        	   _TemplateMap.setFeatureRegMode(true,_SimbolRes.PIN.icon+'1'+_SimbolRes.PIN.type);
        	   _TemplateMap.setCompleteCallback(function(feature){
        		   var item = feature.get('item');
        		   var coord = feature.getGeometry().getCoordinates();
        		   
        		   $('#memoTitle').val('');
        		   $('#memoContent').val('');
           		
        		   $('#memoAddress').val(item.addr);
        		   $('#memox').val(coord[0])
        		   $('#memoy').val(coord[1]);

        		   $('#memoRegDiv').show();
        		   $('#memoViewDiv').hide();
        		   
        		   $('#memoPanel').panel('open');
        		   $('#memoSaveBtn').off(Common.clickEventNm).on(Common.clickEventNm, function(){
        			   $mapMain.model.putMemo();
        			   
        			   _TemplateMap.clearPopup();
        			   
        			   _TemplateMap.setFeatureRegMode(memoMapState.flag, memoMapState.icon);
        			   _TemplateMap.setCompleteCallback(memoMapState.callback);
        			   
        			   $('#memoPanel').panel('close');
        		   });
        		   $('#memoCloseBtn').off(Common.clickEventNm).on(Common.clickEventNm, function(){
        			   $('#memoPanel').panel('close');
        		   });
	       		});
           });
           
           
           $('#chinsuCloseBtn').on(Common.clickEventNm,function(){
        	   $('#chinsuPanel').panel('close');
           });
           $('#mapmainBtn9').on(Common.clickEventNm,function(){
        	   //EPSG:2097
        	   var bound = _TemplateMap.getMapBounds('EPSG:900913');
        	   
           });
           
           // 측단면 미리보기 div
//           $('#csmChartDiv').on(Common.clickEventNm, function(){
//        	   drawCsmChart('csmChart', true );
//        	   
//           });
            // 버튼에 이벤트 등록
           $("#mapMain_panelBtn").on(Common.clickEventNm,function() {
        	   $("#mapMain_panel").panel("open");
           });
            
           $('#mapMain').on('pageshow', setInitMap);
        };
        return pub;
    }());

    // 현재 페이지에서 구성한 MVC를 rima.page에 등록
    rima.page.setModel(page.id, page.model);
    rima.page.setView(page.id, page.view);
    rima.page.setController(page.id, page.controller);

    /**
     *  Page Life Cycle(Activity)
     */
    
    // 페이지가 최초로 생성될 때 호출된다.
    // 화면을 초기화 하고, 각종 이벤트 리스너를 등록하는 등의 코드를 작성한다.
    page.dom.on('onCreate', function() {
        // 초기화 함수 실행
        
    });
    
    // onCreate() 이벤트가 호출된 이후에 바로 호출된다. 두 번째 파라메터에는 prev 페이지에서 넘겨준
    // 데이터가 저장되어 있다. 전달받은 파라메터를 처리하는 코드를 작성한다.
    /*
     * data = {type:업무타입, feature:feature 정보}
     * 
     * */
    page.dom.on('onStart', function(event, data) {
    	var params = Common.getParam();
    	if(data != undefined){
    		params = data;
    	}
    	
    	if(params != undefined){
    		page.model.initParams(params);
    	}
		
    	page.controller.init();
    	
    	$("#mapMainNm").html("<font color='skyblue'>"+Common.loginNm+"</font>님, 안녕하세요.");
    	
    	// history 강제 삭제시 onDestroy 를 위해 등록
    	Common.pushPageInstanceNm('$mapMain');
    	
    });
    // rima.page.startActivity() 에 의하여 페이지가 이동되기 직전에 호출된다.
    // 페이지를 이동하기 전에 처리해야 할 작업(ex 현재 화면의 데이터를 저장)을 위한 코드를 작성한다.
    page.dom.on('onStop', function() {
        // TODO 코드 작성
    });
    // next 페이지에서 current 페이지로 복귀했을 때 호출된다.
    // 두 번째 파라메터에는 next 페이지에서 전달한 결과값이 저장되어 있다. next 페이지에서 리턴받은
    // 데이터를 처리하는 코드를 작성한다.
    page.dom.on('onRestart', function(event, data) {
        // TODO 코드 작성
    	$('#mapMain').on('pageshow', setInitMap);
    });
    // rima.page.finish() 에 의하여 페이지가 삭제되기 직전에 호출된다.
    // 페이지가 삭제되기 전에 처리할 작업을 위한 코드를 작성한다.
    page.dom.on('onDestroy', function() {
        // TODO 코드 작성
    	// iscroll destroy
    	
    	if(featureListIscroll != null){
    		featureListIscroll.destroy();
    		featureListIscroll = null;
    	}
    	if(featureInfoIscroll != null){
    		featureInfoIscroll.destroy();
    		featureInfoIscroll = null;
    	}
    	if(chinsuLayerIscroll != null){
    		chinsuLayerIscroll.destroy();
    		chinsuLayerIscroll = null;
    	}
    	
        featureInfoList = null
        
        csmObj = {};
        
        //  시설물 레이어
        famLayer = null;
    	
        // 점용 레이어
        opmLayer = null;
        
        //관리구역 레이어
        bsmLayer = null;
        
        // 담당업무구역 레이어
        pcmLayer = null;
        
        // 측점 단면 레이어
        csmLayer = null;
        csmCurrentFeature = null;
        
        // 친수레이어
        chinsuLayer = null;
        
        // 순찰위치
        cmlocLayer = null;
        
        $('#bsmDiv').hide();
        
    	_TemplateMap.destroy();
    	
    	$('[data-role="footer"]').show();
    	
    	$mapMain = null;
    });
    
    $mapMain = page;
    
});
