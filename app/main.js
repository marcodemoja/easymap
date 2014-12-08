    
    require.config({
        urlArgs: "bust=" +  (new Date()).getTime(),
        baseUrl: "../",
        async:true,
        paths: {
    		'underscore': 'node_modules/underscore/underscore',
            'jquery' : 'lib/jquery-1.10.2',
            'jquery-ui': 'lib/jquery-ui-1.10.4.min',
            'backbone': 'node_modules/backbone/backbone',
            'infobubble': 'lib/infobubble',
            'views':'app/views',
            'EasyMap':'app/views/app'
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

