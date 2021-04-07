require('dotenv').config();
const EbayAuthToken = require('ebay-oauth-nodejs-client');
const DatabaseHelper = require('../helpers/DatabaseHelper');
const SavedUser = require('../models/SavedUser');
const {v4: uuid4} = require('uuid');
const axios = require('axios');

const authToken = new EbayAuthToken({
    filePath: './config/ebay.json'
});

exports.getUrl = (req, res, next) => {
    const env = process.env.EBAY_ENV || "SANDBOX";
    const uuid = uuid4();
    try {
        const repo = DatabaseHelper.getRepository("SavedUser");
        const user = new SavedUser(uuid, null);
        // repo.save(user);
        const url = authToken.generateUserAuthorizationUrl(env, ['https://api.ebay.com/oauth/api_scope/sell.inventory', 'https://api.ebay.com/oauth/api_scope/sell.account', 'https://api.ebay.com/oauth/api_scope/sell.fulfillment'], {
            state: uuid,
            prompt: false
        });
        res.status(200).send({
            error: false,
            message: '',
            url: url,
            user: uuid
        });
    } catch (error) {
        res.status(403).send({
            error: true,
            message: `Failed to authorize the application. Cause: [${error}]`
        });
    }
}
exports.onGranted = (req, res, next) => {
    DatabaseHelper.getRepository(SavedUser).then(async (repo) => {
        const user = await repo.findOne({
            where: {
                uuid: req.query.state
            }
        });
        authToken.exchangeCodeForAccessToken(process.env.EBAY_ENV || "SANDBOX", req.query.code).then((response) => {
            // user.setAuthToken(response.body.token);
            // user.setRefreshToken(response.body.refresh_token);
            response = JSON.parse(response);
            if (response.error) {
                res.status(500).send({
                    error: true,
                    message: response.error_description
                })
            } else {
                axios.defaults.headers.common['Authorization'] = `IAF ${response.access_token}`;
                res.status(200).send({
                    error: false,
                    access_token: response.access_token,
                    refresh_token: response.refresh_token
                });
            }
        });
        // repo.save(user);
    });
}
