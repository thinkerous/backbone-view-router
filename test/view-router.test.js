(function (factory) {
  'use strict';

  var isNode = typeof module === 'object' && typeof exports === 'object';

  ////////////////////

  var root = isNode ? require('../environment.js') : window;

  ////////////////////

  factory(root, isNode);

}(function (root) {
  'use strict';

  var _ = root._, Backbone = root.Backbone, Globalize = root.Globalize,

  chai = root.chai,
  sinon = root.sinon,

  expect = chai.expect;

  describe('Backbone.view-router', function() {
    var viewRouter = new Backbone.ViewRouter();
    var project = new Backbone.Model({
      "id"    : "1234",
      "name"  : "foobar"
    });
    describe('View Management', function(){
      before(function(){
        Backbone.history.start({pushState:true});
        viewRouter.registerViews({
          ""            : "homeView",
          "projects"    : "listView",
          "projects/:id": "itemView"
        },{
          "homeView"    : "View-Router", 
          "listView"    : "View-Router | Projects",
          "itemView"    : "View-Router | <name>"
        });
      })

      it('should register the correct number of views', function(){
        expect(_.keys(viewRouter.views).length).to.equal(3);
        expect(_.keys(viewRouter.titles).length).to.equal(3);
      })

      it('should reverse routes using without a model', function(){
        expect(viewRouter.revRoute('homeView')).to.equal("");
        expect(viewRouter.revRoute('listView', null)).to.equal("projects");
      });

      it('should reverse routes using given a model', function(){
        expect(viewRouter.revRoute('itemView', project)).to.equal("projects/1234");
      });

      it('should update the page title correctly', function(){
        viewRouter.updateTitle('homeView')
        expect(document.title).to.equal('View-Router');

        viewRouter.updateTitle('listView');
        expect(document.title).to.equal('View-Router | Projects')

        viewRouter.updateTitle('itemView', project);
        expect(document.title).to.equal('View-Router | foobar')
      });

      it('should handle URL on #goToView()', function(){
        viewRouter.goToView('listView',null); 
        expect(window.location.pathname).to.equal('/projects');
        expect(document.title).to.equal('View-Router | Projects')

        viewRouter.goToView('itemView',project); 
        expect(window.location.pathname).to.equal('/projects/1234');
        expect(document.title).to.equal('View-Router | foobar')
      });
    });
  });
}));
