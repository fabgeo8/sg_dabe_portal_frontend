const oidc_client = require("oidc-client")

export default (function () {
    function AuthService() {
        var OIDC_DOMAIN = "https://dev-gm5pjwd8.us.auth0.com";
        var settings = {
            userStore: new oidc_client.WebStorageStateStore({ store: window.localStorage }),
            authority: OIDC_DOMAIN,
            client_id: "QCVDUQuubOq3JMPZFOiK6TrV0Cj6QnAN",
            redirect_uri: "http://localhost:8080/callback.html",
            response_type: "id_token token",
            scope: "openid profile",
            post_logout_redirect_uri: "http://localhost:8080/",
            filterProtocolClaims: true,
            metadata: {
                issuer: OIDC_DOMAIN + "/",
                audience: "http://localhost:3005",
                authorization_endpoint: OIDC_DOMAIN + "/authorize",
                userinfo_endpoint: OIDC_DOMAIN + "/userinfo",
                end_session_endpoint: OIDC_DOMAIN + "/v2/logout",
                jwks_uri: OIDC_DOMAIN + "/.well-known/jwks.json",
            }
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

