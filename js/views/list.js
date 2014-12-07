// Filename: views/project/list
var app = app || {Router:{},Models:{},Collections:{},Views:{},inizialite:function(){}};
define([
  'js/collections/points',
  'text!templates/list.html'
], function( Points , listTemplate){
     var listView = Backbone.View.extend({
     	el: $('#easymap'),
     	template: _.template(listTemplate),
        itemTemplate: "",
        items:[],
     	initialize:function(){
     		this.collection = app.Collections.Points;
     		//this.listenTo(app.Views.MapView.stores, 'reset', this.addElements);
 			//this.model.on('change',this.refreshList);
     	},
     	addElements: function(stores){
            if(this.itemTemplate == ''){
                throw "you have to define the item template";
            }
     		this.$('#storelocator-list-container > ul').html(this.itemTemplate({items:stores.models}));
     	},
     	refreshByVisibleMarkers: function(markers){
            var self = this;
                _.each(markers,function(marker){
                    //console.log(marker);
                    if(marker.visible == true){
                        self.$('#itemList'+marker.storeId).removeClass('notInBound').addClass('inBound');
                    }else{
                        self.$('#itemList'+marker.storeId).removeClass('inBound').addClass('notInBound');
                    }
                });
                self.trigger("listResults:upgraded");
     	            /*	if(this.$('#storelocator-list-container > ul > li').lenght() == 0){
     			            this.$('#storelocator-list-container > ul').append('<li id="noresult">No results found</li>');
     		            }else{
     			            this.$('#noresult').remove();
     		            }*/

     	},
     	render:function(){
            if(this.template == ''){
                throw 'you have to define the list template'
            }
            this.$el.append(this.template);
     		return this;	
     	}
     });
     
     app.Views.ListView = new listView();

});