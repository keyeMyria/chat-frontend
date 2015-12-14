var components = require("./components.js");
var api = require("./api.js");
var shared = require("./shared.js");

// It is possible to map routings implicitly just by including
// route.js without creating mapRoutings(...) function, but it would
// be difficult to understand code stream in app.js if doing that.

var routings = null;
var events = null;

var jumpers = {
  root: function() {
    routings.go({ path: "/" });
  },

  entrance: function() {
    routings.go({ path: "/entrance" });
  },

  error: function() {
    routings.go({ path: "/error" });
  },

  jump: function(args) {
    if (args.path) {
      routings.go({ path: args.path });
    }
  }
};

module.exports = {
  mapRoutings: function(app) {
    routings = new VueRouter();

    routings.map({
      "/": {
        component: components.pages.root
      },
      "/entrance": {
        component: components.pages.entrance
      },
      "/error": {
        component: components.pages.error
      }
    });

    // Always run ping check before transitions
    routings.beforeEach(function() {
      api.pingRequest(function(data, isSucceed) {
        if (!isSucceed) {
          routings.go({ path: "/error" });
        }
      });
    });

    // Im not really sure about it, but shared object
    // gets clear after routings.start(...), so jumpers
    // have to be set just at here. Need more investigation.
    shared.jumpers = jumpers;

    routings.start(app, "body");
  }
};
