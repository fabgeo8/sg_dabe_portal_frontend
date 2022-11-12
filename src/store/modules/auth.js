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
    isLoggedIn: false,
    municipalityList: []
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

    getMunicipalityList(state) {
        return state.municipalityList
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
    updateUserInfo ({commit, dispatch}, municipality) {
        state.userMunicipality = municipality
        state.activeSettingMunicipality = municipality
        state.isMunicipalityUser = true

        console.log("updating user municipality to: " + municipality)

        // if user municipality is null it's a canton user
        if (municipality === null) {
            state.isMunicipalityUser = false
            state.activeSettingMunicipality = 'canton'
            state.activeClient = 'Kanton'
            commit('data/updateMunicipality', municipality, {root:true})
        } else {
            // set municipality for settings and filtering
            state.municipalityList.forEach((m) => {
                if (m.id === municipality) {
                    state.activeClient = m.name
                }
            })
            commit('data/updateMunicipality', municipality, {root:true})
        }
    },
    getUserApiInfo ({ commit, state, dispatch }) {
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
                            dispatch("updateUserInfo", user.MunicipalityId)
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
    },
    async getMunicipalityList ({commit, state}) {
        if (state.municipalityList.length === 0) {
            axios.get('/municipalities')
                .then((res) => {
                    state.municipalityList = res.data
                    state.municipalityList.unshift({
                        id: 'canton',
                        name: 'Kanton'
                    })
                })
                .catch((ex) => {
                    // todo error handling
                    console.log('fetch error: ' + ex.message)
                })
        }
    },

}

const mutations = {
    userSignedOut(state) {
        state.isLoggedIn = false
        state.isAuthorized = false
        state.isAdmin = false
    },
    userSignedIn(state) {
        state.isLoggedIn = true
    },
    updateUserMunicipality (state, municipality) {

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
