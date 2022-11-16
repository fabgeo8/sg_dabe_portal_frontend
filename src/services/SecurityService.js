/* eslint-disable */
import Oidc from 'oidc-client';
import store from '../store'
import axios from "axios";

const OIDC_DOMAIN = process.env.VUE_APP_AUTH_HOST
const BASE_URI = process.env.VUE_APP_BASE_URL

const secureConnectConfig = {
    userStore: new Oidc.WebStorageStateStore(),
    authority: OIDC_DOMAIN,
    client_id: process.env.VUE_APP_AUTH_CLIENT_ID,
    redirect_uri: process.env.VUE_APP_AUTH_REDIRECT_URL,
    response_type: "token id_token",
    scope: "openid profile email urn:abraxas:iam:hosted_domain:sg",
    post_logout_redirect_uri: BASE_URI,
    //silent_redirect_uri: window.location.origin + '/static/silent-renew.html',
    accessTokenExpiringNotificationTime: 10,
    automaticSilentRenew: false,
    filterProtocolClaims: false,
    loadUserInfo: false,
    metadata: {
        issuer: OIDC_DOMAIN + '/',
        authorization_endpoint: OIDC_DOMAIN + "/authorize",
        userinfo_endpoint: OIDC_DOMAIN + "/me",
        end_session_endpoint: OIDC_DOMAIN + "/logout",
        jwks_uri: OIDC_DOMAIN + "/keys",
    }
}

const auth0Config = {
    userStore: new Oidc.WebStorageStateStore(),
    authority: "https://dev-gm5pjwd8.us.auth0.com",
    client_id: "QCVDUQuubOq3JMPZFOiK6TrV0Cj6QnAN",
    redirect_uri: process.env.VUE_APP_AUTH_REDIRECT_URL,
    response_type: "token id_token",
    scope: "openid profile email urn:abraxas:iam:hosted_domain:sg",
    post_logout_redirect_uri: "http://localhost:8080/",
    silent_redirect_uri: window.location.origin + '/static/silent-renew.html',
    accessTokenExpiringNotificationTime: 10,
    automaticSilentRenew: true,
    filterProtocolClaims: false,
    loadUserInfo: false,
    audience: "http://localhost:3005",
}

var mgr = new Oidc.UserManager(secureConnectConfig)

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

mgr.events.addUserLoaded(function (user) {
    console.log('New User Loaded：', arguments);
    //console.log('Acess_token: ', user.access_token)
});

mgr.events.addAccessTokenExpiring(function () {
    console.log('AccessToken Expiring：', arguments);
});

mgr.events.addAccessTokenExpired(function () {
    // access token is expired, logging user out
    store.commit("signOutUser")
    mgr.signoutRedirect().then(function (resp) {

    }).catch(function (err) {
        console.log(err)
    })
});

mgr.events.addSilentRenewError(function () {
    console.error('Silent Renew Error：', arguments);
});

mgr.events.addUserSignedOut(function () {
    console.log('UserSignedOut：', arguments);
    store.commit("signOutUser")
    mgr.signoutRedirect().then(function (resp) {
        console.log('signed out', resp);
    }).catch(function (err) {
        console.log(err)
    })
});

export default class SecurityService {

    // Renew the token manually
    renewToken () {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.signinSilent().then(function (user) {
                if (user == null) {
                    self.signIn(null)
                } else{
                    return resolve(user)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }
    // Get the user who is logged in
    getUser () {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then( function (user) {
                if (user == null) {
                    // self.signIn()
                    return resolve(null)
                } else{
                    return resolve(user)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    setAccessToken (userToken) {
        const authorizationHeader = 'Authorization';
        axios.defaults.headers.common[authorizationHeader] = `Bearer ${userToken}`;
    }

    // Check if there is any user logged in
    getSignedIn () {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    // self.signIn()
                    return resolve(false)
                } else{
                    // user signed in, set authorization token for requests
                    self.setAccessToken(user.access_token)
                    return resolve(true)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Redirect of the current window to the authorization endpoint.
    signIn () {
        mgr.signinRedirect().catch(function (err) {
            console.log(err)
        })
    }

    // Redirect of the current window to the end session endpoint
    signOut () {
        mgr.signoutRedirect().then(function (resp) {
            console.log('signed out', resp);
        }).catch(function (err) {
            console.log(err)
        }).finally(() => {
            store.commit("signOutUser")
        })
    }

    // Get the profile of the user logged in
    getProfile () {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else{
                    return resolve(user.profile)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Get the token id
    getIdToken(){
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else{
                    return resolve(user.id_token)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Get the session state
    getSessionState(){
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else{
                    return resolve(user.session_state)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Get the access token of the logged in user
    getAccessToken(){
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else{
                    return resolve(user.access_token)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Takes the scopes of the logged in user
    getScopes(){
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else{
                    return resolve(user.scopes)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }

    // Get the user roles logged in
    getRole () {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(null)
                } else{
                    return resolve(user.profile.role)
                }
            }).catch(function (err) {
                console.log(err)
                return reject(err)
            });
        })
    }
}