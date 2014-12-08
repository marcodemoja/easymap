var app = app || {Router:{},Models:{},Collections:{},Views:{},inizialite:function(){}};
reqConf([
    'underscore',
    'backbone',
], function( _, Backbone){

    var listView = Backbone.View.extend({
        el: $('#storelocator-container'),
        template: "",
        model: app.Models.StoreModel,
        initialize:function(){
            this.collection = app.Collections.StoreCollection;
            //this.listenTo(app.Views.MapView.stores, 'reset', this.addElements);


            //this.model.on('change',this.refreshList);
        },
        addItem: function(stores){
            var _itemTemplate = _.template(itemTemplate);
            this.$('#storelocator-list-container > ul').html(_itemTemplate({items:stores.models}));
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