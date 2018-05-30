const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUsersByEmail,
    addNewUser    
} = require('../controllers/user.controller');

// GET all the users
router.get('/', getAllUsers);

// GET user by email address
router.get('/:neteller_email_address', getUsersByEmail);

// POST new user
router.post('/', addNewUser);

module.exports = router;