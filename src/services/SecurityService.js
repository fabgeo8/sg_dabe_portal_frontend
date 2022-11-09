/* eslint-disable */
import Oidc from 'oidc-client';

const OIDC_DOMAIN = process.env.VUE_APP_AUTH_HOST;

var mgr = new Oidc.UserManager({
    userStore: new Oidc.WebStorageStateStore(),
    authority: OIDC_DOMAIN,
    client_id: process.env.VUE_APP_AUTH_CLIENT_ID,
    redirect_uri: process.env.VUE_APP_AUTH_REDIRECT_URL,
    response_type: "token id_token",
    scope: "openid profile email urn:abraxas:iam:hosted_domain:sg",
    post_logout_redirect_uri: "http://localhost:8080/",
    silent_redirect_uri: window.location.origin + '/static/silent-renew.html',
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
    },
    signingKeys: [{"use":"sig","kty":"RSA","kid":"431748813854651801","alg":"RS256","n":"xZDcFO1jIpt9Fzjfzb2WDr_Yqu7PN2ylhMcTXvvbHK1lMcXG8kXFkHl7a-RqEAs9_Opt9FC8gZYsMihNXs8FY1HvF0LzRfZmW9l0pI3BUSXECiGuhUuRsk7ZXTCx2TgBOewntNDcgUOSD6SmThau5g74gKDQ37zd4rjEKx7RWFP6iMfDttI_-sm2Fo8vsPHl2_HuSg0yb5UEowkpUJspvRnv5pJ4lMyERd6Oh7fzdgy5qU1NSXj1p_H_C9nuLLLY0uRqvDifsAa8H-RisGKf0eF9bYwRlwosJXbMoKuctubrBs2KQfF7T6r8wAMiHjmDYp-qvRTjixO7hqs4PS9j3w","e":"AQAB"}]
})

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

mgr.events.addUserLoaded(function (user) {
    console.log('New User Loaded：', arguments);
    console.log('Acess_token: ', user.access_token)
});

mgr.events.addAccessTokenExpiring(function () {
    console.log('AccessToken Expiring：', arguments);
});

mgr.events.addAccessTokenExpired(function () {
    console.log('AccessToken Expired：', arguments);
    alert('Session expired. Going out!');
    mgr.signoutRedirect().then(function (resp) {
        console.log('signed out', resp);
    }).catch(function (err) {
        console.log(err)
    })
});

mgr.events.addSilentRenewError(function () {
    console.error('Silent Renew Error：', arguments);
});

mgr.events.addUserSignedOut(function () {
    alert('Going out!');
    console.log('UserSignedOut：', arguments);
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
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
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

    // Check if there is any user logged in
    getSignedIn () {
        let self = this
        return new Promise((resolve, reject) => {
            mgr.getUser().then(function (user) {
                if (user == null) {
                    self.signIn()
                    return resolve(false)
                } else{
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