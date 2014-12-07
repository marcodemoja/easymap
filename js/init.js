    require(EasyMapModules,function(){
    
        require(['EasyMap'],function(EasyMap){
                console.log(EasyMap);
                // customize your map options
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
                        minZoom:6,
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
                console.log(EasyMap);
                EasyMap.initApp(mapOptions,markersIconCondition,filters,function(){});
        });
    });

