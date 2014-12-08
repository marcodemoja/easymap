(function() {
  'use strict';
  // Configure RequireJS to shim Jasmine
  require.config({
            baseUrl: "../../",
            paths: {
                "jquery":"node_modules/jquery/dist/jquery",
                "json-stringify":"node_modules/json-stringify/test/json-stringify",
                "sinon" :"lib/sinon",
                "jasmine-sinon":"lib/jasmine-sinon",
                "jasmine":"lib/jasmine-2.1.3/jasmine",
                "jasmine-html":"lib/jasmine-2.1.3/jasmine-html",
                "boot":"lib/jasmine-2.1.3/boot",
                "underscore": "node_modules/underscore/underscore",
                "backbone":"node_modules/backbone/backbone",
                "domReady": "node_modules/requirejs/dom-ready",
                "models": "models",
                "views":"views",
                "collections":"collections",
                "templates":"templates"
            },
            shim: {
              'backbone':{
                  deps:['jquery']
              },
              'jasmin-sinon':{
                deps:['jasmine']
              },	
              'jasmine': {
              	deps: ['sinon'],
                exports: 'window.jasmineRequire'
              },
              'jasmine-html': {
                deps: ['jasmine'],
                exports: 'window.jasmineRequire'
              },
              'boot': {
                deps: ['jasmine', 'jasmine-html'],
                exports: 'window.jasmineRequire'
              }
            }
        
  });

  // Define all of your specs here. These are RequireJS modules.
  var specs = [
    'app/test/spec/specAppView',
  //  'app/test/spec/specPointsCollection'
  ];

  // Load Jasmine - This will still create all of the normal Jasmine browser globals unless `boot.js` is re-written to use the
  // AMD or UMD specs. `boot.js` will do a bunch of configuration and attach it's initializers to `window.onload()`. Because
  // we are using RequireJS `window.onload()` has already been triggered so we have to manually call it again. This will
  // initialize the HTML Reporter and execute the environment.
  require(['boot','backbone'], function () {

    // Load the specs
    require(specs, function () {

      // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
      window.onload();
    });
  });
})();        