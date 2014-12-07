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
         
         useClusters:true,
         
         markersIconCondition:null,
         
         enableMarkerClick:true,
         
         searchedCoords:null,
         
         searchedAddress:null,
         
         asyncSearch:true,
         
         template: _.template(mapTemplate),

         currentAddress:'',

         directionsService  : new google.maps.DirectionsService(),

         directionsDisplay : new google.maps.DirectionsRenderer(),

        initialize:function(){
         	var that  = this;
            var result;
         	this.collection = app.Collections.Points;
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
         
         render:function(mapOptions){
       		this.$el.append(this.template);
         	this.activate(mapOptions);
         	return this;
         	
         },
        /**
      	 Refresh results list with the lasts stores found
      	**/
    	 refreshResultList: function(){
    		//app.Views.ListView.refreshByVisibleMarkers(this.markers);
             app.Views.ListView.addElements(this.stores);
    	 },

         filterResultsList: function(){

         },
         /**
          * Add loader to map
          * This method append a div with class storelocator-loader to the map container (this.$el)
          */
      	addLoader: function(){
      		var loader = $('<div>').addClass('storelocator-loader');
      		//console.log(this.$el);
      		this.$el.append(loader);
      	},
         /**
          * Remove loader to map
          * This method remove the loader
          */
        removeLoader: function(){
      		$('.storelocator-loader').remove();
      	},
        /*
        * Render markers closest to address passed as argument
        * @params address
        * */
        searchByAddress: function(address){
        	this.geocodeAddress(address);
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
        autofitMap: function(){
        	var bounds = new google.maps.LatLngBounds();
        	_.each(this.markers,function(marker){
        		if(marker.visible == true)
        			bounds.extend(marker.getPosition());
        	});
            console.log(bounds);
        	this.map.fitBounds(bounds);
        },
        /**
        * Obtain coordinates from address passed as param and center map to it
        **/
        geocodeAddress: function(address){
             this.trigger('searchAddress:beforeAddressGeocoded');
        	 var geocoder = new google.maps.Geocoder();
        	 var self = this;
        	 geocoder.geocode( { 'address': address}, function(results, status) {
			     if (status == google.maps.GeocoderStatus.OK) {
                    var pointCoords = results[0].geometry.location;
                    //console.log(pointCoords.lat());
                    //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
			        self.searchedCoords = { 'lat' : pointCoords.lat() , 'lng':pointCoords.lng()};
                    self.$('#searchedCoords').val(pointCoords.lng()+','+pointCoords.lng());
                    self.searchedAddress = address;
                    self.removeMarkers();
         			self.map.setCenter(pointCoords);
			       /* var marker = new google.maps.Marker({
			            map: self.map,
			            position: results[0].geometry.location
			        });*/
			        
			       //__callback({lat:results[0].geometry.location.A,lng:results[0].geometry.location.K});
			       self.trigger('searchAddress:addressGeocoded');
			     } else {
			        alert("Invalid address");
			        self.removeLoader();
			     }
			 });
        },

       getAddressFromLatLng: function(url,_callback){
           var self  = this;
           //$.support.cors = true;
           $.getJSON(url,function(response){
               _callback(response);
           }).error(function(jqXHR, textStatus, errorThrown){
               if(errorThrown == 'No Transport'){
                   $.support.cors = true;
                   self.getAddressFromLatLng(url, _callback);
               }else{
                   self.staticPosition();
               }
           });
       },
        
       getCurrentPosition: function(){
           var self  = this;
           if(!navigator.userAgent.match(/(Lumia)/)){
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        self.getAddressFromLatLng('http://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+","+position.coords.longitude,function(response){
                            self.currentAddress = response.results[0].formatted_address;
                            self.searchedAddress = response.results[0].formatted_address;
                            self.currentPosition = new google.maps.LatLng(position.coords.latitude , position.coords.longitude);
                            app.Views.MapView.centerMap(self.currentPosition);
                            app.Views.MapView.zoomMap(9);
                            $('#storelocator-input-search').val(self.currentAddress);
                            $('#storelocator-input-search-mobile').val(self.currentAddress);
                            $('.direction-a').val(self.currentAddress);
                            $('#searchedCoords').val(position.coords.latitude+","+position.coords.longitude);
                            self.searchedCoords = {'lat':position.coords.latitude,'lng':position.coords.longitude};
                            self.trigger('geocoder:positionFinded');

                        });
                    }, self.staticPosition());
                }
        }else{
            self.staticPosition();
        }

       },
        
        staticPosition:function(){
            var self  = this;
            self.currentPosition = new google.maps.LatLng(45.8485269, 8.9463012);
            $('#searchedCoords').val("45.8485269,8.9463012");
            self.stores = self.collection.findAround({lat:45.8485269,lng:8.9463012});
            app.Views.MapView.centerMap(self.currentPosition);
            app.Views.MapView.zoomMap(9);
            self.trigger('geocoder:positionFinded');
        },
        
        centerMap:function(coords){
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
         	return _.each(app.Views.MapView.markers,function(el,index,list){
         			el.setMap(null);
         	});
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
            _.each(this.stores.models,function(store,index,list){
         		var position = new google.maps.LatLng( store.attributes.lat, store.attributes.lng);
         		var iconUrl  = '';
                var iconSize =  new google.maps.Size(23, 36);
         		var filters  = [];
         		var filter;
         		
         		if(typeof self.markersIconCondition !== "undefined" && self.markersIconCondition !== {}){
         			if(typeof(self.markersIconCondition.icon) !== 'undefined'){
                        iconUrl = self.markersIconCondition.icon;
                    }else{
                        _.each(self.markersIconCondition.values,function(value,key){
                            if(store.attributes[self.markersIconCondition.column] == key){
                                iconUrl = value;
                            }
                        });
                    }
                }
         		for(var i in store.attributes.store_collections){
         			filter = _.keys(store.attributes.store_collections[i]).toString();
         			filters.push(filter);
         		}
         		 
         		filters.push(store.attributes.store_type_id);
         		
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
		            title: store.attributes.post_title,
		            visible:true,
		            icon:iconImage,
		            storeId:store.attributes.ID,
                    formattedAddress:store.attributes["wpcf-yoox-store-address"],
                    attributes: store.attributes
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
		     this.trigger('markersAddress');
		     //console.log(this.markers);
         }
     }); //-- End of Map view
     
     app.Views.MapView = new mapView();
     
     return app.Views.MapView;
 
});