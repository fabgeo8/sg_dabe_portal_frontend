import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import de from 'vuetify/lib/locale/de'

Vue.use(Vuetify)

const vuetify = new Vuetify({
  lang: {
    locales: {
      de
    },
    current: 'de'
  },
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
