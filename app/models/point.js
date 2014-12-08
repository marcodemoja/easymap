// Filename: models/store
var app = app || {Router:{},Models:{},Collections:{},Views:{},inizialite:function(){}};
define([
], function(){
  app.Models.Point = Backbone.Model.extend({
      defaults: {
          ID:"0",
          title: "",
          lat:"0.0",
          lng: "0.0",
          distance: "0.0",
          continent: "",
          country: "",
          city: "",
          isocode: "",
          filters: []
        },
    initialize: function(){
    },
    parse:function(item){
        return item;
    }
    
  });
  
  return app.Models.Point;
  
});