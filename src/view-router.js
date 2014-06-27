(function (factory) {
  'use strict';

  var isNode = typeof module === 'object' && typeof exports === 'object';

  ////////////////////

  var root = isNode ? {
    _: require('underscore'),
    Backbone: require('backbone'),
    Globalize: require('globalize')
  } : window;

  ////////////////////

  (isNode ? exports : Backbone).Schema = factory(root, isNode);

}(function (root) {
  'use strict';

  var _ = root._, Backbone = root.Backbone;
  var ViewRouter = Backbone.ViewRouter = Backbone.Router.extend({

    views: {},
    titles: {},
    buffered: false, 
    titleRoot: "",
    

    ////////////////////////////////////////////////////////////////////
    // View Management Functions
    ////////////////////////////////////////////////////////////////////

    // Used to register a [route,title] <--> view pair
    // titles is an optional parameter for controlling page title based view
    // both parameters are objects. Routes are key-value pairs of route-view pairs
    // while titles are view-title pairs.
    registerViews: function(routes, titles){
      // Views --> Routes
      _.each(routes,function(v,r){
        // Remove *Splats
        r = r.replace(/\*.*$/,"");
        this.views[v] = r;
      },this);

      // Views --> Titles
      _.extend(this.titles, (titles || {}));
    }, 

    // Short cut for using revRoute and then navigating
    goToView: function(view, model, options){
      var route = this.revRoute(view, model);
      var currentRoute = Backbone.history.getFragment().replace(this._cleanFragment,"");
      if(route === currentRoute) return;  

      this.updateTitle(view, model); 
      return this.navigate(route, options);
    },

    // Return only the target URL of where the view is located, no routing occurs
    revRoute: function(view, model){ 
      var route = this.views[view]; 
      if(typeof route === "undefined") throw "No matching route for \"" + view + "\" for given arguments."; 
      var parts = route.split(/\//);
                              route = _.map(parts,function(v){
        return v.replace(/^:([^()]+).*/,function(str, prop){
return "" + model.get(prop); 
        });
      }).join('/');

      // Runtime check: revRoute replaced all the necessary elements!
      var unmatched = route.match(/:[^\/?]*/);
      if (unmatched !== null){
        var elements = "";
        _.each(unmatched,function(e){ 
          elements += e.substr(1) + " ";
        });
        throw "Unmatched Route Elements: " + elements; 
      }

      return route;
    }, 

    // This function updates the page title based on a view and model
    updateTitle: function(view, model){
      var title = this.titleRoot + this.titles[view]; 
      document.title = title.replace(/<([A-Za-z_]+)>/g,function(str,v){
        return "" + model.get(v);
      });
    },


    ////////////////////////////////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////////////////////////////////

    // URL managment RegExs
    _cleanFragment: /\?.*$/,

    // Override the default navigate function for a router to allow it to keep state
    // state when desired.
    navigate: function(fragment, options){
      options = (options || {query : ""});
      if(options.query){
        fragment = fragment + ( options.query || "" );
      }
      Backbone.history.navigate(fragment, options);
    }, 

    _getUrl: function(){
      return Backbone.history.location.pathname.substr(1);
    }
  });

  _.extend(Backbone,ViewRouter);

  if(typeof module !== 'undefined') module.exports = ViewRouter;

  return Backbone;
}));
