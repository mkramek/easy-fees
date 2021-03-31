const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');

router.get('/auth/login/url', controller.getUrl);
router.get('/auth/login/granted', controller.onGranted);

module.exports = router;
