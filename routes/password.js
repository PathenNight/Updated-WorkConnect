const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController'); // Import the controller

// --- Password Reset Routes ---
router.post('/forgot-password', passwordController.forgotPassword); // Request password reset
router.post('/reset-password', passwordController.resetPassword);   // Reset password

// --- Account Recovery Routes ---
router.post('/recover-by-email', passwordController.recoverByEmail);
router.post('/recover-by-key', passwordController.recoverByKey);
router.post('/send-otp', passwordController.sendOTP); // Optional
router.post('/verify-otp', passwordController.verifyOTP); // Optional
router.post('/verify-answer', passwordController.verifyAnswer);

module.exports = router;
