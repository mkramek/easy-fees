require('dotenv').config();
const EbayAuthToken = require('ebay-oauth-nodejs-client');
const DatabaseHelper = require('../helpers/DatabaseHelper');
const SavedUser = require('../models/SavedUser');
const {v4: uuid4} = require('uuid');

const authToken = new EbayAuthToken({
    filePath: './config/ebay.json'
});

exports.getUrl = async (req, res, next) => {
    const env = process.env.EBAY_ENV || "SANDBOX";
    const uuid = uuid4();
    try {
        const repo = await DatabaseHelper.getRepository("SavedUser");
        const user = new SavedUser(uuid, null);
        repo.save(user);
        const url = await authToken.generateUserAuthorizationUrl(env, ['sell.fulfillment', 'sell.inventory'], {
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
        authToken.exchangeCodeForAccessToken(process.env.EBAY_ENV || "SANDBOX", req.body.code).then((response) => {
            user.setAuthToken(response.body.token);
            user.setRefreshToken(response.body.refresh_token);
        });
        repo.save(user);
    });
}
