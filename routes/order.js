const express = require('express');
const router = express.Router();
const controller = require('../controllers/order');

router.get('/order/:id', controller.getOrder);
router.get('/order/:id/costs', controller.getOrderAdditionalCosts);

module.exports = router;
