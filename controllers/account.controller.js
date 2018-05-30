// import models / db connections
const mongoose = require('mongoose');
const {Account} = require('../models/index');


// GET all the accounts
function getAllAccounts (req, res, next) {
    return Account.find({})
    .then(accounts => {
        return res.status(200).send({accounts})
    })
    .catch(() => next({status: 500, message: 'server error'}))
}

// GET accounts by country code
function getAccountsByCountryCode (req, res, next) {
    let countryCode = req.params.country.toUpperCase();    
    return Account.find({country: countryCode})
    .then(accounts => {
        if (accounts.length === 0) throw {status: 404, message: `There are no accounts with country code: ${countryCode}`}
        else return res.status(200).send({accounts})
    })
    .catch(err => {
        if (err.status === 404) return next(err);
        else return next({status: 500, message: 'server error'});
    })
}


module.exports = {
    getAllAccounts,
    getAccountsByCountryCode
}