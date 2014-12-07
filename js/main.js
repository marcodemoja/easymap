    
    require.config({
        urlArgs: "bust=" +  (new Date()).getTime(),
        baseUrl: "../",
        async:true,
        paths: {
    		'underscore': 'js/node_modules/underscore/underscore',
            'jquery' : 'js/lib/jquery-1.10.2',
            'jquery-ui': 'js/lib/jquery-ui-1.10.4.min',
            'backbone': 'js/node_modules/backbone/backbone',
            'infobubble': 'js/lib/infobubble',
            'views':'js/views',
            'EasyMap':'js/views/app'
        },
        shim: {
        'backbone':{
            deps:['underscore','jquery']
        },
        'jquery': {
            exports: 'jQuery'
        },
        'jquery-ui': {
                deps: ['jquery'],
                exports: '$'
        }
        }
    });

    var EasyMapModules =  ['backbone','jquery','underscore','jquery-ui'];

