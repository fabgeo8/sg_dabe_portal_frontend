import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#008334',
        secondary: '#01f60e',
        accent: '#8c9eff',
        error: '#b71c1c'
      }
    }
  }
})

export default vuetify
