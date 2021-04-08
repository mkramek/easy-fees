const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const orderController = require('../controllers/order');
const itemRouter = require('./item');

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

router.post('/order', orderController.getAllOrders);
router.get('/order/:id', orderController.getOrder);
router.get('/order/:id/costs', orderController.getOrderAdditionalCosts);

router.use('/item', itemRouter);

module.exports = router;
