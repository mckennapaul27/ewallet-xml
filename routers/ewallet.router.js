const express = require('express');
const router = express.Router();
const {getAccountReport} = require('../seed/seed');

router.get('/', getAccountReport);

module.exports = router;


