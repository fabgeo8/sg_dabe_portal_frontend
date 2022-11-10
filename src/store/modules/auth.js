import axios from 'axios'

const state = {
    isMunicipalityUser: true,
    userMunicipality: '',
    activeSettingMunicipality: '',
    activeClient: 'Kanton',
    isAdmin: true,
    AccessKey: ''
}

const getters = {
    getUserMunicipality (state) {
        return state.userMunicipality
    },

    getIsMunicipalityUser (state) {
        return state.isMunicipalityUser
    },

    getUserLocation (state) {
        return state.isMunicipalityUser ? state.userMunicipality : 'canton'
    },

    getActiveClient (state) {
        return state.activeClient
    },

    getIsAdmin (state) {
        return state.isAdmin
    },

    getActiveSettingMunicipality(state) {
        return state.activeSettingMunicipality !== 'canton'
    }
}

const actions = {

}

const mutations = {
    updateUserMunicipality (state, municipality) {
        state.userMunicipality = municipality
        state.activeSettingMunicipality = municipality
        state.isMunicipalityUser = true
        state.activeClient = 'Thal'

        // if user municipality is null it's a canton user
        if (municipality === null) {
            state.isMunicipalityUser = false
            state.activeSettingMunicipality = 'canton'
            state.activeClient = 'Kanton'
        }
    },
    updateIsMunicipalityUser (state, isMunicipalityUser) {
        state.isMunicipalityUser = isMunicipalityUser
    },
    updateIsAdmin (state, isAdmin) {
        state.isAdmin = isAdmin
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
