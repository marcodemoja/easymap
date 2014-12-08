var EasyMap = EasyMap || {};
define([
  'js/collections/points',
  'text!templates/app.html',
  'js/views/map',
  'js/views/list'
], function(Points,appTemplate,mapView,listView){

   var _EasyMap = Backbone.View.extend({

        el: $("div#easymap"),
       	isMobileDevice: navigator.userAgent.match(/(iPhone|iPod|Android|BlackBerry)/),
        template: _.template(appTemplate),
        filtersTemplate: "",
        currentPosition:{},
        autoLocateMyPosition:true,    
        autoComplete:{},
        
        events: {
              "touchstart #easymap-switch-view-button"   : "switchListMapButtonEvent",
              "touchstart .easymap-expand-item-list-btn" : "openStoreDetail",
              "click #easymap-search-button"  			     : "searchAddress",
              "touchstart #easymap-filter-button"		     : "openCloseFilters"
        //      "click touchstart #storelocator-get-direction-button"      : "getDirections"
        },

        /*If touchstart is not enabled*/
        prepareEvents: function(){
        },
	
        initialize: function(){
        	//this.model      = app.Models.Point;
        	this.collection = app.Collections.Points;

            /*refresh all views when collection change and sync*/
            this.listenTo(this.collection,'reset',this.refresh);
            /*update input values in DOM*/
            this.listenTo(this,'addresschanged',this.onAddressChange);

        },
    
        init: function(mapOptions,markersIconCondition,filters,_callback){
          if(this.template == ''){
                throw "you have to define the app template";
          }
          var self = this;
        	//this.setMarkersIconConditions(markersIconCondition);
        	this.mapOptions = mapOptions;
          app.Views.MapView.markersIconCondition = markersIconCondition;
          this.renderApp();

          this.collection.fetch({
            success:function(){
              if(self.autoLocateMyPosition === true){
                self.geolocateClientPosition(function(position){
                  self.findAround(position);   
                });
              }else{
                self.refresh();
              }        
            }
          });
          // this.prepareEvents();
          if(typeof(_callback) !== 'undefined')
            _callback();    
        },

        renderApp:function(){
            this.$el.append(this.template);
            this.render();
            app.Views.MapView.render(this.mapOptions);
            app.Views.ListView.render();
        },

        refresh: function(){
            app.Views.MapView.refresh();
            app.Views.ListView.refresh();
        },

        findAround: function(position,_callback){
            this.collection.filterByDistance(position);
            mapView.autofitMap(position);
            if(typeof(_callback) !== 'undefined')
                _callback();
        },

        getAddressFromLatLng: function(url,_callback){
           var self  = this;
           //$.support.cors = true;
           $.getJSON(url,function(response){
               _callback(response);
               self.trigger('addresschanged');
           }).error(function(jqXHR, textStatus, errorThrown){
               if(errorThrown == 'No Transport'){
                   $.support.cors = true;
                   self.getAddressFromLatLng(url, _callback);
               }else{
                   self.staticPosition();
               }
           });                                  
       },

        geolocateClientPosition: function(_callback){
           var self  = this;
           if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                       self.currentPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);       
                       self.getAddressFromLatLng('http://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+","+position.coords.longitude,function(response){
                            self.currentAddress = response.results[0].formatted_address;
                        });
                        _callback(self.currentPosition);
                });
            }
        },

         /**
        * Obtain coordinates from address passed as param and center map to it
        **/
        geocodeAddress: function(address,_callback){
          this.trigger('searchAddress:beforeAddressGeocoded');
          var geocoder = new google.maps.Geocoder();
          var self = this;
          geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              self.currentPosition = results[0].geometry.location;
              self.currentAddress = address;
              self.trigger('addresschanged');
              _callback(self.currentPosition);
            } else {
              alert("Invalid address");
              self.removeLoader();
           }
           });
        },

        onAddressChange: function(){
            $('#easymap-input-search').val(this.currentAddress);
            $('#coords').val(this.currentPosition.lat()+","+this.currentPosition.lng());
        },

        searchAddress: function(e){
          var self = this;

          if(this.filtersTemplate !== '')
            this.resetFilters();

          address = this.setAddress(e);

          if(address == 'nearest'){
              if(this.autoLocateMyPosition !== true){
                this.geolocateClientPosition(function(position){
                  self.findAround(position);   
                });
              }
            return;
          }else{
            this.geocodeAddress(address,function(position){
              self.findAround(position);
            });
          }
        },

        setAddress: function(e){
          var result,inputSelector, addressFromInput;
          if(typeof(e) == 'undefined'){
            result = this.getParamFromQueryString('address');
          }else{
            inputSelector =  $(e.currentTarget).parent().find('input[type="text"]');
            addressFromInput = $(inputSelector).val();
            result = addressFromInput;
          }
          this.setCookie('address' , result, 2);
          mapView.searchedAddress = result;

          return result;
        },

        getParamFromQueryString: function(name){
          name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
          var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
          return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },

        setCookie: function(cname, cvalue, exdays){
          var d = new Date();
          d.setTime(d.getTime() + (exdays*24*60*60*1000));
          var expires = "expires="+d.toGMTString();
          document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
        },

        getCookie: function(cname){
          var name = cname + "=";
          var ca = document.cookie.split(';');
          for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
              if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
            }
            return "";
        },

        render: function(){
            return this;
        }
    });
    EasyMap = new _EasyMap();
    // Returning instantiated views can be quite useful for having "state"
    return EasyMap;


});

