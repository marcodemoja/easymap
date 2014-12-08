define([
	'app/views/app',
	'app/views/map'
	],function(EasyMap,mapView){

		describe('App.Views.AppView',function(){
			this.appView,this.mapView,this.spyAppView,this.spyMapView;
			
			beforeEach(function () {
					this.appView = EasyMap;
					this.mapView = mapView;
					this.spyAppView = sinon.spy(this.appView,'init');
					this.spyMapView = sinon.spy(this.mapView,'activate');
					
					/*var fixtures = '<div id="easymap"></div>';
					$('body').append(fixtures);*/

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
	                this.appView.init(mapOptions,markersIconCondition,filters,function(){});
					
					
				});

				afterEach(function() {
					this.appView = "";
					this.mapView = "";
					this.spyMapView.reset();
					this.spyAppView.reset();
				});

			/*describe argumets for first test*/				
			describe("->init",function(){
				it("should init the app",function(){
					expect(this.spyAppView.calledOnce).toBeTruthy();
					expect(this.spyMapView.calledOnce).toBeTruthy();
					
					expect(this.appView.$el.selector).toBe('div#easymap');
					expect(typeof this.appView.currentPosition.lat).toBe('function');
				});
			});

		});
});