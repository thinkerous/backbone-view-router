backbone-view-router
====================

Organize routes into intuitive "views", reverse matching a view to an appropriate route

# Overview 
The purpose of this plugin is to handle updating the URL on page changes automatically using 
a view name and (optionally) a model. This plugin is slightly opinionated: I believe that 
each route should be connected to a specific "view" (in a many to one relationship) and designed 
this with that mentality. For example, /projects should point to a "viewProjects" view which 
would correspond to a controller function of the same name. 

Optionally the router handles the page title updates which can happen automatically when going
to the corresponding view. If a view isn't registered with a title it will be updated to the `viewRouter.titleRoot` variable. 

# Use
This router first registers views in a similar way to registering routes in the Backbone.Router.
At the same time these views can be registered to page titles optionally. 

```
  ViewRouter.registerViews({
      // List of routes
      ""              : "home",
      "projects"      : "listProjects", 
      "projects/:id"  : "viewProject"
    },{
      "home"         : "View-Router"
      "listProjects" : "View-Router | Projects"
      "viewProject"  : "View-Router | <name>"
    });
```

Then the following functions can then be called with predicable results (note the model must have corresponding
`id` and `name` attributes, say they are "1234" and "foobar" respectively).

```
  ViewRouter.revRoute("listProjects") // Returns "projects"

  ViewRouter.goToView("listProjects") // URL set to "/projects", triggers route, 
                                      // page title set to "View-Router | Projects" 

  ViewRouter.goToView("viewProject")  // URL set to "/projects/1234", triggers route, 
                                      // page title set to "View-Router | foobar" 
```
