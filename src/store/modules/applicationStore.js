import axios from 'axios'
import { showSnack } from '@/globalActions'

const state = {
  persisted: {
    municipality: 0,
    dateFrom: new Date(Date.UTC(new Date().getFullYear(), 0, 1)).toISOString().substr(0, 10),
    dateTo: new Date().toISOString().substr(0, 10),
    applicationType: 'gas',
    isMunicipalityUser: true,
    userMunicipality: '',
    municipalityList: []
  },
  gasApplications: [],
  pvApplications: [],
  pvDashboardStats: {},
  gasDashboardStats: {},
  loadingData: false
}

const getters = {
  getGasApplications (state) {
    return state.gasApplications
  },
  getPvApplications (state) {
    return state.pvApplications
  },
  getApplicationType (state) {
    return state.persisted.applicationType
  },
  getMunicipalityList(state) {
    return state.persisted.municipalityList
  }
}

const actions = {
  async getGasApplications ({ commit, state }) {
    state.loadingData = true
    const params = new URLSearchParams([['municipality', state.persisted.municipality], ['dateFrom', state.persisted.dateFrom], ['dateTo', state.persisted.dateTo]])
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
  },
  async getMunicipalityList ({commit, state}) {
    axios.get('/municipalities')
        .then((res) => {
          state.municipalityList = res.data
          this.municipalityList.unshift({
            id: 'canton',
            name: 'Kanton'
          })
        })
        .catch((ex) => {
          // todo error handling
          console.log('fetch error: ' + ex.message)
        })
  },
  async getPvApplications ({ commit, state }) {
    state.loadingData = true
    const params = new URLSearchParams([['municipality', state.persisted.municipality], ['dateFrom', state.persisted.dateFrom], ['dateTo', state.persisted.dateTo]])
    axios.get('/applications/pv', { params })
      .then((res) => {
        commit('setPvApplicationList', res.data)
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
    state.persisted.municipality = municipality
  },
  updateDateFrom (state, date) {
    state.persisted.dateFrom = date
  },
  updateDateTo (state, date) {
    state.persisted.dateTo = date
  },
  setGasApplicationList (state, value) {
    state.gasApplications = value
  },
  setPvApplicationList (state, value) {
    state.pvApplications = value
  },
  updateApplicationType (state, value) {
    state.persisted.applicationType = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
