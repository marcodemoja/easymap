// Filename: views/project/list
var app = app || {Router:{},Models:{},Collections:{},Views:{},inizialite:function(){}};
define([
  'js/collections/points',
  'text!templates/map.html'
], function(Points,mapTemplate){
     
     var mapView = Backbone.View.extend({
         
         el: $('#easymap'),
         markers:[],
         markersInfoWindows:[],
         markersInfoWindowTemplate : '',
         map:{},
         markersInBound:[],
         useClusters:false,
         markersIconCondition:null,
         enableMarkerClick:true,
         searchedCoords:null,
         searchedAddress:null,
         asyncSearch:true,
         template: _.template(mapTemplate),
         directionsService  : new google.maps.DirectionsService(),
         directionsDisplay : new google.maps.DirectionsRenderer(),

        initialize:function(){
         	var that  = this;
            var result;
         	this.collection = app.Collections.Points;
        },
      	
      	render:function(mapOptions){
       		this.$el.append(this.template);
         	this.activate(mapOptions);
         	return this;
         	
        },

        refresh: function(){
            this.removeMarkers();
            this.addMarkers();
            this.autofitMap();
        },
       
        activate: function(mapOptions) {
            if(this.template == ''){
                throw "you have to define the map template";
            }

            if(typeof(mapOptions) == 'undefined'){
                 var latlng = new google.maps.LatLng(35.5, -100);
                this.mapOptions = {
                     zoom: 8,
                     center: latlng,
                     mapTypeControl: false,
                     navigationControl:false,
                     maxZoom:11,
                     minZoom:8,
                     mapTypeId: google.maps.MapTypeId.ROADMAP,
                     streetViewControl: false,
                     styles: [{featureType:"administrative",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"landscape.natural",stylers:[{hue:"#0000ff"},{lightness:-84},{visibility:"off"}]},{featureType:"water",stylers:[{visibility:"on"},{saturation:-61},{lightness:-63}]},{featureType:"poi",stylers:[{visibility:"off"}]},{featureType:"road",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"landscape",stylers:[{visibility:"off"}]},{featureType:"administrative",stylers:[{visibility:"off"}]},{},{}]
                  };
            
             }else{
                this.mapOptions = mapOptions;
             }
            var mapContainer = this.$('#google-map');
            mapContainer.height(this.$('body').height).width(this.$('body').width);
            this.map = new google.maps.Map(mapContainer.get(0), this.mapOptions);
        },
         
        /**
          * Add loader to map
          * This method append a div with class storelocator-loader to the map container (this.$el)
          */
      	addLoader: function(){
      		var loader = $('<div>').addClass('easymap-loader');
      		//console.log(this.$el);
      		this.$el.append(loader);
      	},
         /**
          * Remove loader to map
          * This method remove the loader
          */
        removeLoader: function(){
      		$('.easymap-loader').remove();
      	},

        showMarkersByLatLng: function(latLng){
        	this.centerMap(latLng);
        },
        
        showMarkersInBound: function(coords,self){
        	this.markersInBound = [];
        	
        	var circle  = new google.maps.Circle({
        					center: coords,
        					radius: 50000,
        					map:self.map,
        					//strokeColor: '#FF0000',
      						strokeOpacity: 0,
      						strokeWeight: 0,
      						//fillColor: '#FF0000',
      						fillOpacity: 0,
      						});
        	
        	_.each(self.markers,function(marker){
        		if(circle.getBounds().contains(marker.getPosition())){
        			marker.setVisible(true);
        			self.markersInBound.push(marker);
        		}else{
        			marker.setVisible(false);
        		}
        	});
        	self.trigger("searchAddress:markersShowed");
        },
        /*
        * Fit map for viewing all markers showed
        **/
        autofitMap: function(position){
        	var bounds = new google.maps.LatLngBounds();
            /*current position must be added to bound*/
            bounds.extend(position);
        	_.each(this.markers,function(marker){
        		if(marker.visible == true)
        			bounds.extend(marker.getPosition());
        	});
            this.map.fitBounds(bounds);
        },
       
        centerMap:function(coords){
            console.log(coords);
         	this.map.setCenter(coords);
         },
         
         zoomMap:function(zoom){
         	this.map.setZoom(zoom);
         },
         
         setClusterOptions: function(clusterOptions){
         	this.useClusters = true;
         	if(typeof clusterOptions.ignoreHidden == 'undefined'){
         		clusterOptions.ignoreHidden = true;
         	}
         	this.clusterOptions = clusterOptions;
         },
         
         clusterizeMarkers: function(){
         	this.markerClusterer = new MarkerClusterer(this.map,this.markers, this.clusterOptions);
         },
         
         addMarkerClick: function(marker,callback){
         	google.maps.event.addListener(marker,'click',callback);

         },
         
         removeMarkers: function(){
            var self = this;
         	_.each(this.markers,function(el,index,list){
         			el.setMap(null);
            });
            this.markers = [];
         },

         markerInfoWindow: function(markerInfo){
             var infoWin = new InfoBubble({
                     content: this.markersInfoWindowTemplate({data:markerInfo}),
                     position: new google.maps.LatLng(markerInfo.lat, markerInfo.lng),
                     shadowStyle: 0,
                     padding: 0,
                     backgroundColor: 'transparent',
                     borderRadius: 0,
                     arrowSize: 0,
                     borderWidth: 0,
                     minWidth:300,
                     maxWidth:300,
                     minHeight:175,
                     maxHeight:175,
                     borderColor: '#ccc',
                     disableAutoPan: true,
                     hideCloseButton: true,
                     arrowPosition: 40,
                     backgroundClassName: 'phoney',
                     arrowStyle: 2
             });

             this.markersInfoWindows[markerInfo.ID] = infoWin;

             return infoWin;
         },
         /**
         * @desc Write direction on map
         * @param {String} origin
         * @param {String} destination
         * @param {String} mode ( DRIVING - BICYCLING - WALKING )
         **/
         getDirection: function(origin,destination,mode){
             var self = this;
             this.directionsDisplay.setMap(self.map);
             this.directionsDisplay.setPanel(document.getElementById('storelocator-directions-panel'));

                 var request = {
                     origin: origin,
                     destination: destination,
                     travelMode: mode
                 };
                 this.directionsService.route(request, function(response, status) {
                     if (status == google.maps.DirectionsStatus.OK) {
                         self.directionsDisplay.setDirections(response);
                     }else{
                         self.trigger('storelocatorApp:getDirectionFailed');
                     }
                 });
         },
         /**
          * Close all infoboxes opened in the map
          **/
         closeInfoBoxes: function(){
             _.each(this.markersInfoWindows,function(item,i){
                 if(item.isOpen_ === true){
                     item.close();
                 }
                 $('div.phoney').remove();
                 app.Views.ListView.$('.storelocator-item-list').removeClass('active');
             });
         },
         /**
         *Set marker click behaviour
         * var self = this;
         * self.closeInfoBoxes();
         * var infoWindow = self.markerInfoWindow(marker.attributes);
         * self.selectedAddress = marker.attributes.formatted_address;
         *  self.selectedLatLng  = marker.attributes.lat+","+marker.attributes.lng;
         * var center;
         * if(app.Views.AppView.isMobileDevice == null)
         *  center  = new google.maps.LatLng(marker.position.lat(),marker.position.lng());
         * else
         * center  = new google.maps.LatLng((marker.position.lat()+0.2) ,(marker.position.lng()+0.05));
         * self.centerMap(center);
         * infoWindow.open(self.map,marker);
         * self.$('#storelocator-list-container').animate({
         * scrollTop: app.Views.ListView.$('#itemList'+marker.storeId).position().top},
         * 500
         * );
         * app.Views.ListView.$('#itemList'+marker.storeId).addClass('active');
         **/
         markerClick:function(marker){
             var self = this;
             self.closeInfoBoxes();
             var infoWindow = self.markerInfoWindow(marker.attributes);
             self.selectedAddress = marker.attributes.formatted_address;
             self.selectedLatLng  = marker.attributes.lat+","+marker.attributes.lng;
             var center;
             if(app.Views.AppView.isMobileDevice == null)
                 center  = new google.maps.LatLng(marker.position.lat(),marker.position.lng());
             else
                 center  = new google.maps.LatLng((marker.position.lat()+0.2) ,(marker.position.lng()+0.05));


             self.centerMap(center);
             infoWindow.open(self.map,marker);
             /*self.$('#storelocator-list-container').animate({
                     scrollTop: app.Views.ListView.$('#itemList'+marker.storeId).position().top},
                 500
             );*/
             app.Views.ListView.$('#itemList'+marker.storeId).addClass('active');

         },
         
         addMarkers:function(){
         	var self = this;
            _.each(this.collection.models,function(point,index,list){
         		var position = new google.maps.LatLng( point.attributes.lat, point.attributes.lng);
         		var iconUrl  = '';
                var iconSize =  new google.maps.Size(23, 36);
         		var filters  = [];
         		var filter;
         		
         		if(typeof self.markersIconCondition !== "undefined" && self.markersIconCondition !== {}){
         			if(typeof(self.markersIconCondition.icon) !== 'undefined'){
                        iconUrl = self.markersIconCondition.icon;
                    }else{
                        _.each(self.markersIconCondition.values,function(value,key){
                            if(point.attributes[self.markersIconCondition.column] == key){
                                iconUrl = value;
                            }
                        });
                    }
                }
         		/*for(var i in point.attributes.store_collections){
         			filter = _.keys(store.attributes.store_collections[i]).toString();
         			filters.push(filter);
         		}*/
         		 
         		//filters.push(point.attributes.store_type_id);
         		
                if(iconUrl !== ''){
                    var iconImage = new google.maps.MarkerImage(iconUrl,
                        null,
                        null,
                        null,
                        iconSize
                    );
                }


                var marker = new google.maps.Marker({
		        	position: position,
		            map: self.map,
		            title: point.attributes.title,
		            visible:true,
		            icon:iconImage,
		            emId:point.attributes.ID,
                    attributes: point.attributes
                    //storeTypeId:store.attributes.store_type_id,
		            //filters:filters
		        });



                if(this.markersInfoWindowTemplate !== ''){
                    google.maps.event.addListener(marker,'click',function(){
                        self.markerClick(marker);
                    });
                }

		    	self.markers.push(marker);

            });
		    //console.log(self.markers);

		    
		    
		    if(this.useClusters == true){
		    	if(typeof(this.clusterOptions) == 'undefined'){
		    		this.clusterOptions = {
		    			maxZoom: null,
          				gridSize: null,
          				styles: null 
        			};
		    	}
		    	
		    	this.clusterizeMarkers(this.clusterOptions);
		     }
		     this.trigger('markersready');
		     //console.log(this.markers);
         }
     }); //-- End of Map view
     
     app.Views.MapView = new mapView();
     
     return app.Views.MapView;
 
});