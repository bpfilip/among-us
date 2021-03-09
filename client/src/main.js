import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

Vue.config.productionTip = false

import Vuex from "vuex";
import VueSocketIO from 'vue-socket.io'

Vue.use(Vuex);

const store = new Vuex.Store({});

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: process.env.NODE_ENV === 'production' ? "https://amongus.bpfilip.dk/" : `${window.location.protocol}//${window.location.hostname}:8081`,
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
