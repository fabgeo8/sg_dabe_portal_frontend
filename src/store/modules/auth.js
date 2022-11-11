import axios from 'axios'

const state = {
    isMunicipalityUser: true,
    userMunicipality: '',
    isAuthorized: null,
    activeSettingMunicipality: '',
    activeClient: 'Kanton',
    isAdmin: true,
    AccessKey: '',
    isLoggedIn: false
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

    getIsLoggedIn (state) {
        return state.isLoggedIn
    },

    getActiveSettingMunicipality(state) {
        return state.activeSettingMunicipality !== 'canton'
    }
}

const actions = {

    getUserApiInfo ({ commit, state }) {

        // get user info if info is not set
        if (!state.isAuthorized) {
            console.log("get user info from api")
            axios.get('users/me', )
                .then((res) => {
                    if (res.status === 200) {
                        // user is authorized and can access application
                        // store user info to state
                        if (res.data && res.data.length > 0) {
                            let user = res.data
                            state.isAuthorized = user.is_authorized
                            state.isAdmin = user.role_name === 'admin'
                            commit("updateUserMunicipality", user.MunicipalityId)
                        } else {
                            state.isAuthorized = false
                        }
                    } else {
                        state.isAuthorized = false
                    }
                })
                .catch((ex) => {
                    console.log('fetch userinfo failed: ' + ex.message)
                    state.isAuthorized = false
                    showSnack({ message: 'Benutzer konnte nicht geladen werden.', color: 'red' })
                })
                .finally(() => {
                })
        }
    }

}

const mutations = {
    updateUserInfo(state) {
    },
    userSignedOut(state) {
        state.isLoggedIn = false
        state.isAuthorized = false
        state.isAdmin = false
    },
    userSignedIn(state) {
        state.isLoggedIn = true
    },
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
