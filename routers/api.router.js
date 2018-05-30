const express = require('express');
const router = express.Router();
const reportRouter = require('./report.router');
const userRouter = require('./user.router');
const accountRouter = require('./account.router');

router.get('/', (req, res, next) => {
    return res.render('pages/index');
})

router.use('/accounts', accountRouter);

router.use('/reports', reportRouter);

router.use('/users', userRouter);

module.exports = router;


