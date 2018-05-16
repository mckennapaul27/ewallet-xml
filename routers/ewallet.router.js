const express = require('express');
const router = express.Router();
const {getAccountReport} = require('../controllers/ewallet-controller');

router.get('/', getAccountReport);

module.exports = router;


