// import models / db connections
const mongoose = require('mongoose');
const {User} = require('../models/index');


// GET all the users
function getAllUsers (req, res, next) {
    return User.find({})
    .then(users => {
        return res.status(200).send({users})
    })
    .catch(() => next({status: 500, message: 'server error'}))
}

// GET users by neteller_email_address
function getUsersByEmail (req, res, next) {
    let email = req.params.neteller_email_address;
    return User.find({neteller_email_address: email})
    .then(user => {
        if (user.length === 0) throw {status: 404, message: `There is no member with email address: ${email}`}
        else return res.status(200).send({user})
    })
    .catch(err => {
        if (err.status === 404) return next(err);
        else return next({status: 500, message: 'server error'});
    })
}

// Adds new user to database
function addNewUser (req, res, next) {    
    return new User({
        username: req.body.username,
        neteller_email_address: req.body.neteller_email_address,
        neteller_account_id: req.body.neteller_account_id
    }).save() 
    .then(newUser => {
        return res.status(201).send(newUser);
    })
    .catch(err => {
        return res.status(500).send(err)
    }) 
}




module.exports = {
    getAllUsers,
    getUsersByEmail,
    addNewUser
}