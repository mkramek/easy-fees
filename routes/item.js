const express = require('express');
const router = express.Router();
const controller = require('../controllers/item');

router.get('/item/:id', controller.getItem);
router.get('/item/:id/taxes', controller.getItemTaxes);

module.exports = router;
