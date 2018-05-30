const express = require('express');
const router = express.Router();
const {
    getAllAccounts,
    getAccountsByCountryCode
} = require('../controllers/account.controller');

// GET all the accounts
router.get('/', getAllAccounts);

// GET accounts by country code
router.get('/:country', getAccountsByCountryCode);

module.exports = router;