Vue.use(VueRouter);

var app = Vue.extend({});
var router = new VueRouter();

var components = {
  root: Vue.extend({
    template: require("./main.html")
  }),
  entrance: Vue.extend({
    template: require("./entrance.html")
  }),

  partials: {
    header: Vue.extend({
      template: require("./components/_header.html")
    }),
    sidebar: Vue.extend({
      template: require("./components/_sidebar.html")
    }),
    messages: Vue.extend({
      template: require("./components/_messages.html")
    })
  }
};

Vue.component("va-header", components.partials.header);
Vue.component("va-sidebar", components.partials.sidebar);
Vue.component("va-messages", components.partials.messages);

router.map({
  "/": {
    component: components.root
  },
  "/entrance": {
    component: components.entrance
  }
});
router.start(app, ".main-view-wrapper");

