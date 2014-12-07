define([
		'collections/points',
		'models/point'
	],
	function(Points,Point){

		describe("app.Collections.Points",
			function(){
				
				 beforeEach(function () {
				    	this.points = app.Collections.Points; 
				        
				    	this.fixture = {
				    		Points:
				    		[
				    			{"ID":"1","title":"test-title","lat": "57.049362","lng": "9.918987"},
				    			{"ID":"2","title":"test-title2","lat": "57.049362","lng": "9.918987","filters":["122"]}
				    		]		
				    	};

				        this.server = sinon.fakeServer.create();
				    	this.server.respondWith(
				    		"GET",
				    		"data/data.json",
				    		[ 200 , {"Content-Type":"application/json"},
								JSON.stringify(this.fixture.Points)
				    		]
				    	);

					    this.points.fetch();
					    this.server.respond();
				    });

				    afterEach(function() {
				      this.server.restore();
				    });

				describe('->fetch', function() {
				   
					 describe('#request', function() {
					    beforeEach(function () {
					        this.request = this.server.requests[0];
					    });
					    it('should make a correct request',function(){
					    	expect(this.server.requests.length).toEqual(1);
					   		expect(this.server.requests[0].method).toEqual('GET');
					   		expect(this.server.requests[0].url).toEqual('data/data.json');
					   	});
					   	
					});

					describe('#response',function(){
						it('should return a valid collection',function(){
					   		expect(this.points.length).not.toBe(0);
					   		expect(this.points.models[1].get('title')).toEqual(this.fixture.Points[1].title);
					   	});
					});
				});

				describe('->getFiltered',function(){
					describe('#attributeContains',function(){
						it('should filter a collection by attribute "filters" that contains "122"',function(){
							expect(this.points.getFiltered(["122"]).length).toEqual(1);
						});
					});
				});

				

			}
		);

	}
);