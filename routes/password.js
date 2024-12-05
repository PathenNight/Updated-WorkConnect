const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController'); // Import the controller

// --- Password Reset Routes ---
router.post('/forgot-password', passwordController.forgotPassword); // Request password reset
router.post('/reset-password', passwordController.resetPassword);   // Reset password

// --- Account Recovery Routes ---
router.post('/recover-by-key', passwordController.recoverByKey);         // Recover account by recovery key
router.post('/recover-by-email', passwordController.recoverByEmail);     // Recover account by email
router.post('/verify-answer', passwordController.verifyAnswer);          // Verify security question answer

module.exports = router;
