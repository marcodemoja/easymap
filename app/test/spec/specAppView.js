define([
	'app/views/app'
	],function(appView){
		describe('App.Views.AppView',function(){
			this.appView,this.mapView,this.spyAppView,this.spyMapView;
			
			beforeEach(function () {
					this.EasyMap = EasyMap;
					console.log(EasyMap);
					this.spyAppViewInit     = sinon.spy(this.EasyMap.Views.appView,'init');
					this.spyMapViewActivate = sinon.spy(this.EasyMap.Views.mapView,'activate');
					
					

					var mapOptions = {
                        zoom: 6,
                        center: new google.maps.LatLng(45.58329, 9.140625),
                        mapTypeControl: false,
                        navigationControl:true,
                        panControlOptions:{
                            position: google.maps.ControlPosition.TOP_RIGHT
                        },
                        zoomControlOptions:{
                            position: google.maps.ControlPosition.TOP_RIGHT
                        },
                        maxZoom:19,
                        minZoom:2,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        streetViewControl: false,
                        disableDefaultUI: false
                        //      styles: [{featureType:"all",elementType:"all",stylers:[{saturation:-100}]}]
                	};
                    /*how we should create a condition for marker's icons */
	                var markersIconCondition = {
	                        // column:'store_type_id',
	                        // values:[]
	                };
	                markersIconCondition.icon =  'http://cdn3.yoox.biz/napapijri/wp-content/images/pin-2x.png?bust=' +  (new Date()).getTime() +'';
	                filters = {};
	                this.EasyMap.Views.appView.init(mapOptions,markersIconCondition,filters,function(){});
					
					
				});

				afterEach(function() {
					this.spyMapView.reset();
					this.spyAppView.reset();
				});

			/*describe argumets for first test*/				
			describe("->init",function(){
				it("should init the app",function(){
					expect(this.spyAppView.calledOnce).toBeTruthy();
					expect(this.spyMapView.calledOnce).toBeTruthy();
					expect(this.EasyMap.Views.appView.$el.selector).toBe('div#easymap');
					expect(typeof this.EasyMap.Views.appView.currentPosition).not.toBe(null);
					expect(typeof this.EasyMap.Views.appView.currentAddresss).not.toBe(null);
					
				});
			});

		});
});