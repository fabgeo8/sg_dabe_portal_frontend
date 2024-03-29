import axios from 'axios'
import { showSnack } from '@/globalActions'

const state = {
  persisted: defaultState(),
  gasApplications: [],
  pvApplications: [],
  municipalityItems: [],
  pvDashboardStats: {},
  gasDashboardStats: {},
  loadingData: false
}

function defaultState () {
  return {
    municipality: 0,
    dateFrom: new Date(Date.UTC(new Date().getFullYear(), 0, 1)).toISOString().substr(0, 10),
    dateTo: new Date().toISOString().substr(0, 10),
    applicationType: 'gas',
    gasOperatorList: []
  }
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
  getGasOperatorList (state) {
    return state.persisted.gasOperatorList
  }
}

const actions = {
  updateData({dispatch, state}) {
    if (axios.defaults.headers.common['Authorization']) {
      dispatch('getGasOperators')
    }
  },
  async getGasApplications ({ commit, state }) {
    state.loadingData = true
    const params = new URLSearchParams([['municipality', state.persisted.municipality], ['dateFrom', state.persisted.dateFrom], ['dateTo', state.persisted.dateTo]])
    axios.get('/applications/gas', { params })
      .then((res) => {
        commit('setGasApplicationList', res.data)
      })
      .catch((ex) => {
        console.log('fetch application failed: ' + ex.message)
        showSnack({ message: 'Gesuchliste konnte nicht geladen werden.', color: 'red' })
      })
      .finally(() => {
        state.loadingData = false
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
        showSnack({ message: 'Gesuchliste konnte nicht geladen werden.', color: 'red' })
      })
      .finally(() => {
        state.loadingData = false
      })
  },
  async getMunicipalityList ({ commit, state}) {
    axios.get('/municipalities')
        .then((res) => {
          state.municipalityItems = res.data
          if (Array.isArray(state.municipalityItems))
            state.municipalityItems.unshift({
              id: 0,
              name: 'alle Gemeinden'
            })
        })
        .catch((ex) => {
          console.log('fetch error: ' + ex.message)
        })
  },
  async getGasOperators ({ commit, state }) {
    axios.get('/settings/gas_operators')
        .then((res) => {
          commit('setGasOperatorList', res.data)
        })
        .catch((ex) => {
          console.log('fetch gasoperator failed: ' + ex.message)
          showSnack({ message: 'Gasversorgerliste konnte nicht geladen werden.', color: 'red' })
        })
        .finally(() => {
        })
  }
}

const mutations = {
  updateMunicipality (state, municipality) {
    state.persisted.municipality = municipality
  },
  resetData (state) {
    state.persisted = defaultState()
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
  },
  setGasOperatorList (state, value) {
    state.persisted.gasOperatorList = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
