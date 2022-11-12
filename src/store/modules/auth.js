import axios from 'axios'
import {showSnack} from "../../globalActions";

const state = {
    isMunicipalityUser: true,
    userMunicipality: '',
    isAuthorized: null,
    lastRequestTimestamp: null,
    activeSettingMunicipality: '',
    activeClient: 'Kanton',
    isAdmin: true,
    AccessKey: '',
    isLoggedIn: false
}

// expiration of user info in sec
const userInfoExpiration = 5

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
    },

    getUserInfoIsExpired (state) {
        if (state.lastRequestTimestamp === null) {
            return true
        } else {
            if (Date.now() - state.lastRequestTimestamp > userInfoExpiration * 1000) {
                console.log("user info expired, renewing...")
                return true
            }
        }
        return false
    }
}

const actions = {
    getUserApiInfo ({ commit, state }) {
        // get user info if info is not set
        // also get info if user info request is expired
        if (!state.isAuthorized || getters.getUserInfoIsExpired(state)) {
            console.log("get user info from api")
            axios.get('users/me', )
                .then((res) => {
                    if (res.status === 200) {
                        // user is authorized and can access application
                        // store user info to state
                        console.log("userinfo is accessed")
                        if (res.data && res.data.fullname) {
                            state.lastRequestTimestamp = Date.now()
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
                    // showSnack({ message: 'Benutzer konnte nicht geladen werden.', color: 'red' })
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
