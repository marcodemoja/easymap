// Filename: collections/stores
var app = app || {Router:{},Models:{},Collections:{},Views:{},inizialite:function(){}};
define([
  'js/models/point'
], function(Point){
	
   var Points = Backbone.Collection.extend({
       model: app.Models.Point,
       url: 'data/data.json',
       sort_key: 'distance',

    parse: function(response) {
       return response;
    },
    comparator: function(item) {
        return item.get(this.sort_key);
    },
  	
    orderByDistance: function(){
        //return
    },

  	getFiltered: function(filterValues){
  		var self = this;
  		var result = _.filter(this.models,function(item){
  		  var filter;
  			var _return=false;
        var filters = item.get('filters');
  			
        for(var i in filters){
            	filter = filters[i];
         	  	if(_.contains(filterValues,filter)){
         				_return = true;
         			}
         }
         	return _return;
  		});

      this.trigger('changed');

      return result;

  	},
    
    filterByDistance: function(position){
        var self = this;
        var result = _.filter(this.models,function(item){
            try{
                var distance = self.getDistance(item.get('lat') ,item.get('lng'), position.lat, position.lng, 'K');
                item.attributes.distance = distance;
                return distance >= 0 && distance <= 80;
            }catch(err){
                return true;
            }
    	   });
        this.trigger('changed');
        return result;
    },

    getDistance: function(lat1, lon1, lat2, lon2, unit){
    		var radlat1 = Math.PI * lat1/180;
    		var radlat2 = Math.PI * lat2/180;
    		var radlon1 = Math.PI * lon1/180;
    		var radlon2 = Math.PI * lon2/180;
    		var theta = lon1-lon2;
    		var radtheta = Math.PI * theta/180;
    		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    		dist = Math.acos(dist);
    		dist = dist * 180/Math.PI;
    		dist = dist * 60 * 1.1515;
    		if (unit=="K") { dist = dist * 1.609344; }
    		if (unit=="N") { dist = dist * 0.8684; }
    		return dist;
  	}
  	
  });
  app.Collections.Points = new Points();
  
  return app.Collections.Points;
  
});