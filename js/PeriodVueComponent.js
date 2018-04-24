var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var _periodVue = function() {
	// private functions & variables
	var _peiodVueInstance = null;
	
	var template = '<select v-on:change="changedPeriod" v-model="firstSelect">'+
						'<option v-for="opt in periodSelectDataList" :value="opt.value" >{{opt.text}}</option>'+
					'</select>';
	
	function createComponent(id){
		return _peiodVueInstance = new Vue({
			  el: '#'+id, 
			  data: {
				  firstSelect:'1',
				  periodSelectDataList:[{value:'1', text:'1'},{value:'2', text:'2'},{value:'3', text:'3'}]
			  },
			  // app 뷰 인스턴스를 위한 메소드들
			  methods: {
				  changedPeriod: function(evt) {
			      	console.log(evt);
			      	console.log(evt.value);
			    }
			  },
			  template: template
			});
	}
	// public functions
	return {

		init : function(id) {
			var me = this;
			return createComponent(id);
		}
	};
}();
