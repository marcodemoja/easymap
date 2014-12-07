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
        currentPosition:null,
        autoLocateMyPosition:true,    
        autoComplete:{},
        
        events: {
              "touchstart #storelocator-switch-view-button"   : "switchListMapButtonEvent",
              "touchstart .storelocator-expand-item-list-btn" : "openStoreDetail",
              "click .storelocator-search-button"  			  : "searchAddress",
              "touchstart #storelocator-filter-button"		  : "openCloseFilters"
        //      "click touchstart #storelocator-get-direction-button"      : "getDirections"
        },

        /*If touchstart is not enabled*/
        prepareEvents: function(){
        },
	
        initialize: function(){
        	//this.model      = app.Models.Point;
        	this.collection = app.Collections.Points;

            /*Refresh all views when collection changing*/
            this.listenTo(this.collection,"changed",this.refresh);
        },
    
        initApp: function(mapOptions,markersIconCondition,filters,_callback){
            
            
            if(this.template == ''){
                throw "you have to define the app template";
            }
            
            var self = this;
        	//this.setMarkersIconConditions(markersIconCondition);
        	this.mapOptions = mapOptions;
            
            this.renderApp();
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
            console.log('refreshAll');
        },

        findAround: function(position,filters,_callback){
            this.collection.filterByDistance(position);

            if(typeof(_callback) !== 'undefined')
                _callback();
        },

        render: function(){
            return this;
        }
    });
    EasyMap = new _EasyMap();
    // Returning instantiated views can be quite useful for having "state"
    return EasyMap;


});

