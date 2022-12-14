import Vuex from 'vuex'
import Vue from 'vue'
import VuexPersist from 'vuex-persist'
import applicationStore from './modules/applicationStore'
import authStore from './modules/auth'

// Load Vuex
Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.sessionStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  reducer: state => ({
    data: {
      persisted: state.data.persisted
    },
    auth: state.auth
  }),
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
})

// Create store
export default new Vuex.Store({
  modules: {
    auth: authStore,
    data: applicationStore
  },
  plugins: [vuexLocalStorage.plugin]
})
