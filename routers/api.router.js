const express = require('express');
const router = express.Router();
const {getAccountReport} = require('../controllers/ewallet-controller');

router.get('/', (req, res, next) => {
    return res.render('pages/index');
})

router.get('/fetch-stats', getAccountReport);

module.exports = router;


