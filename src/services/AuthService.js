const oidc_client = require("oidc-client")

export default (function () {
    function AuthService() {
        var OIDC_DOMAIN = process.env.VUE_APP_AUTH_HOST;
        var settings = {
            userStore: new oidc_client.WebStorageStateStore({ store: window.localStorage }),
            authority: OIDC_DOMAIN,
            client_id: process.env.VUE_APP_AUTH_CLIENT_ID,
            redirect_uri: process.env.VUE_APP_AUTH_REDIRECT_URL,
            response_type: "token id_token",
            scope: "openid profile email urn:abraxas:iam:hosted_domain:sg",
            post_logout_redirect_uri: "http://localhost:8080/",
            // filterProtocolClaims: false,
            loadUserInfo: false,
            metadata: {
                issuer: OIDC_DOMAIN + '/',
                //audience: "http://localhost:3005",
                authorization_endpoint: OIDC_DOMAIN + "/authorize",
                userinfo_endpoint: OIDC_DOMAIN + "/me",
                end_session_endpoint: OIDC_DOMAIN + "/logout",
                jwks_uri: OIDC_DOMAIN + "/keys",
            },
            signingKeys: [{"use":"sig","kty":"RSA","kid":"423051494292503418","alg":"RS256","n":"wHMkz31GStrLs7ATyksNlOvE8H0QMGnIZD4F1YCKc97IFIYCa9oqDns1UqtoSkelet_d0keegyISdaqjeGCV2CTldJ1QlkI4WfYstePSgkyS97ypVafzvJdHZR9_aBfQmi-_wo4t71TnqZ8dbO0mKm0uPq6C0-KUa_o4F4Pi3895rLNcY9b5CMs2hV9LYkAnBWnSYtaaZFqJWeshTquClkcif2wOuEKlUdgJEaQdGwkB7yc6JCAICzL5tejNqhX7L-LfgmPDxeV65KsONsqHiXeVpwW0Y2G5Z3xpd8toZrSkpPjyEF4mLkzPW4K9HzrocdFHegvbxt64dSctMZFG8Q","e":"AQAB"}]
        };
        this.userManager = new oidc_client.UserManager(settings);
    }
    AuthService.prototype.getUser = function () {
        return this.userManager.getUser();
    };
    AuthService.prototype.login = function () {
        return this.userManager.signinRedirect();
    };
    AuthService.prototype.logout = function () {
        return this.userManager.signoutRedirect();
    };
    AuthService.prototype.getAccessToken = function () {
        return this.userManager.getUser().then((data) => {
            console.log(data)
            return data.access_token
        })
    }
    return AuthService;
}())

