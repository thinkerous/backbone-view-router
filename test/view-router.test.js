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
    var project = new Backbone.Model({
      "id"    : "1234",
      "name"  : "foobar"
    });
    describe('Title Management', function(){
      it("should not change the title by default", function(){
        var viewRouter = new Backbone.ViewRouter();

        document.title = "foobar";
        viewRouter.updateTitle('undefined');
        expect(document.title).to.equal("foobar");
      });
      it("should accept a titleRoot parameter", function(){
        var viewRouter = new Backbone.ViewRouter({titleRoot: "View-Router"});

        viewRouter.registerViews({});
        document.title = "foobar";
        viewRouter.updateTitle('undefined');
        expect(document.title).to.equal("View-Router");
      });
      it("should default titleRoot if views are specified", function(){
        var viewRouter = new Backbone.ViewRouter();
        viewRouter.registerViews({},{
          "homeView"    : "View-Router", 
          "listView"    : "View-Router | Projects",
          "itemView"    : "View-Router | <name>"
        });

        document.title = "foobar";
        viewRouter.updateTitle("homeView");
        expect(document.title).to.equal("View-Router");
        
        viewRouter.updateTitle("listView");
        expect(document.title).to.equal("View-Router | Projects");

      });
      it('should update the page title correctly', function(){
        var viewRouter = new Backbone.ViewRouter({titleRoot: "View-Router"});

        viewRouter.registerViews({},{
          "homeView"    : "", 
          "listView"    : " | Projects",
          "itemView"    : " | <name>"
        });

        viewRouter.updateTitle('homeView')
        expect(document.title).to.equal('View-Router');

        viewRouter.updateTitle('listView');
        expect(document.title).to.equal('View-Router | Projects')

        viewRouter.updateTitle('itemView', project);
        expect(document.title).to.equal('View-Router | foobar')
        
        viewRouter.updateTitle('undefined', project);
        expect(document.title).to.equal('View-Router')
      });

    });
    describe('View Management', function(){
      var viewRouter = new Backbone.ViewRouter();

      before(function(){
        Backbone.history.start({pushState:true});
        viewRouter.registerViews({
          ""            : "homeView",
          "projects"    : "listView",
          "projects/:id": "itemView",
          ":undefined"  : "missingArgument"
        },{
          "homeView"    : "View-Router", 
          "listView"    : "View-Router | Projects",
          "itemView"    : "View-Router | <name>"
        });
      })

      it('should register the correct number of views', function(){
        expect(_.keys(viewRouter.views).length).to.equal(4);
        expect(_.keys(viewRouter.titles).length).to.equal(3);
      })

      it('should reverse routes using without a model', function(){
        expect(viewRouter.revRoute('homeView')).to.equal("");
        expect(viewRouter.revRoute('listView', null)).to.equal("projects");
      });

      it('should reverse routes using given a model', function(){
        expect(viewRouter.revRoute('itemView', project)).to.equal("projects/1234");
      });


      it('should handle URL and title on #goToView()', function(){
        viewRouter.goToView('listView',null); 
        expect(window.location.pathname).to.equal('/projects');
        expect(document.title).to.equal('View-Router | Projects')

        viewRouter.goToView('itemView',project); 
        expect(window.location.pathname).to.equal('/projects/1234');
        expect(document.title).to.equal('View-Router | foobar')
      });
      
      it('should generate errors for invalid parameters', function(){
        var invalidView = function(){
          return viewRouter.revRoute("undefined", project);
        };
        expect(invalidView).to.throw(/No matching route/i);
        var invalidView = function(){
          return viewRouter.revRoute("missingArgument", project);
        };
        expect(invalidView).to.throw(/Unmatched Route Element/i);
      });
    });
  });
}));
