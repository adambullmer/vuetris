import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import "@/registerServiceWorker";
import fontawesome from "@fortawesome/fontawesome";
import regular from "@fortawesome/fontawesome-pro-regular";

fontawesome.library.add(regular);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
