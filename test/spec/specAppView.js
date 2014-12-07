define([
	'views/app'
	],function(AppView){

		describe('App.Views.AppView',function(){
			beforeEach(function () {
					this.view = app.Views.AppView;
					spyOn(this.view,'render');
					spyOn(this.view,'refresh');
					spyOn(this.view,'renderApp');
					this.view.render();
					this.view.refresh();
					this.view.renderApp();
				});

				afterEach(function() {
				});

				
			describe("->render",function(){
				it("should render the view",function(){
					expect(this.view.render).toHaveBeenCalled();
					expect(this.view.refresh).toHaveBeenCalled();
					expect(this.view.$el.selector).toBe('div#easymap');
				});
			});

			describe("->renderApp",function(){
				it("should render all easymap views",function(){
					expect(this.view.renderApp).toHaveBeenCalled();
				});
			});
		});
});