import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueSessionStorage from 'vue-sessionstorage'

// axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL

Vue.config.productionTip = false

new Vue({
  router,
  VueSessionStorage,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
