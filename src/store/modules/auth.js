import axios from 'axios'
import { showSnack } from '@/globalActions'

const state = {
  municipality: 0,
  gasApplications: [],
  dateFrom: new Date(Date.UTC(new Date().getFullYear(), 0, 1)).toISOString().substr(0, 10),
  dateTo: new Date().toISOString().substr(0, 10),
  loadingData: false
}

const getters = {
  getGasApplications (state) {
    return state.gasApplications
  }
}

const actions = {
  async getGasApplications ({ commit, state }) {
    state.loadingData = true
    const params = new URLSearchParams([['municipality', state.municipality], ['dateFrom', state.dateFrom], ['dateTo', state.dateTo]])
    axios.get('/applications/gas', { params })
      .then((res) => {
        commit('setGasApplicationList', res.data)
      })
      .catch((ex) => {
        console.log('fetch application failed: ' + ex.message)
        showSnack({ message: 'Gesuchsliste konnte nicht geladen werden.', color: 'red' })
      })
      .finally(() => {
        state.loadingData = false
      })
  }
}

const mutations = {
  updateMunicipality (state, municipality) {
    state.municipality = municipality
    this.dispatch('getGasApplications')
  },
  updateDateFrom (state, date) {
    state.dateFrom = date
  },
  updateDateTo (state, date) {
    state.dateTo = date
  },
  setGasApplicationList (state, value) {
    state.gasApplications = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
