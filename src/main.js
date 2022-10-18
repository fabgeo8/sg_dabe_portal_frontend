import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VuexPersist from 'vuex-persist'

// axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL

import { createOidcAuth, SignInType } from 'vue-oidc-client/vue2';

// note the ending '/'
const appUrl = 'https://portal.govforms.ch/';
const OIDC_DOMAIN = process.env.VUE_APP_AUTH_HOST;

// SignInType could be Window or Popup
var mainOidc = createOidcAuth('main', SignInType.Window, appUrl , {
  authority: OIDC_DOMAIN,
  client_id: process.env.VUE_APP_AUTH_CLIENT_ID,
  redirect_uri: process.env.VUE_APP_AUTH_REDIRECT_URL,
  response_type: "token id_token",
  scope: "openid profile email urn:abraxas:iam:hosted_domain:sg",
  post_logout_redirect_uri: "http://localhost:8080/",
  // filterProtocolClaims: false,
  loadUserInfo: false,
  metadata: {
    issuer: OIDC_DOMAIN + '/',
    //audience: "http://localhost:3005",
    authorization_endpoint: OIDC_DOMAIN + "/authorize",
    userinfo_endpoint: OIDC_DOMAIN + "/me",
    end_session_endpoint: OIDC_DOMAIN + "/logout",
    jwks_uri: OIDC_DOMAIN + "/keys",
  }
});

mainOidc.useRouter(router);

Vue.config.productionTip = false

mainOidc.startup().then(ok => {
  if (ok) {
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
