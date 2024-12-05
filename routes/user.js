const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Create a new user
router.post('/create', userController.createUser);

// Get a user by ID
router.get('/:id', userController.getUserByID);

module.exports = router;
