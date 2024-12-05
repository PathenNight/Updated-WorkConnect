const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login a user
router.post('/login', authController.login);

// Logout a user
router.post('/logout', authController.logout);

// Fetch security questions
router.get('/security-questions', authController.getSecurityQuestions);

// Update user details
router.put('/update/:id', authController.updateUser);

module.exports = router;
