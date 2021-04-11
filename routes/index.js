const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const orderController = require('../controllers/order');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.status(200).send({
        error: false,
        message: 'EasyFees API'
    });
});

router.get('/auth/login/url', authController.getUrl);
router.get('/auth/accepted', authController.onGranted);
router.post('/auth/access_token', authController.setAuthHeader);

router.post('/fees', orderController.getOrderFees);

module.exports = router;
