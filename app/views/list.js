define([
  'app/collections/points',
  'text!templates/list.html',
  'text!templates/item.html'
], function( Points , listTemplate, itemTemplate){
     var listView = Backbone.View.extend({
     	el: $('#easymap'),
     	template: _.template(listTemplate),
        itemTemplate: _.template(itemTemplate),
     	initialize:function(){
     		this.collection = Points;
     	},
     	refresh: function(){
            if(this.itemTemplate == ''){
                throw "you have to define the item template";
            }
     		this.$('#easymap-list-container > ul').html(this.itemTemplate({items:this.collection.models}));
     	},
     	render:function(){
            if(this.template == ''){
                throw 'you have to define the list template'
            }
            this.$el.append(this.template);
     		return this;	
     	}
     });
     
     var _listView = new listView();

     return _listView;
});