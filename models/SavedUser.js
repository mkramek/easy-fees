class SavedUser {
    constructor(uuid, auth_code) {
        this.uuid = uuid;
        this.auth_code = auth_code;
        this.auth_token = null;
        this.refresh_token = null;
        this.email = null;
    }

    setRefreshToken(token) {
        this.refresh_token = token;
    }

    setAuthToken(token) {
        this.auth_token = token;
    }

    setEmail(email) {
        this.email = email;
    }
}

module.exports = SavedUser;
