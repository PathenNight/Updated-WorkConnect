const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Use shared connection pool

// Set up Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- Forgot Password ---
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const [user] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expiry = new Date(Date.now() + 3600000); // 1 hour expiry

        await pool.query('UPDATE Users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?', [
            hashedResetToken,
            expiry,
            email
        ]);

        const resetUrl = `${process.env.FRONTEND_URL}/reset/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `You requested a password reset. Click here to reset your password: ${resetUrl}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: 'Error requesting password reset.' });
    }
};

// --- Reset Password ---
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const [user] = await pool.query('SELECT * FROM Users WHERE resetToken = ? AND resetTokenExpiry > NOW()', [
            hashedToken
        ]);

        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE Users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?', [
            hashedPassword,
            user[0].id
        ]);

        res.json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password.' });
    }
};

// --- Recover by Key ---
const recoverByKey = async (req, res) => {
    const { recoveryKey } = req.body;

    try {
        const [user] = await pool.query('SELECT * FROM Users WHERE recoveryKey = ?', [recoveryKey]);
        if (user.length === 0) {
            return res.status(404).json({ found: false });
        }

        res.json({ found: true, email: user[0].email });
    } catch (error) {
        console.error('Error recovering by key:', error);
        res.status(500).json({ message: 'Error recovering account.' });
    }
};

// --- Recover by Email ---
const recoverByEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const [user] = await pool.query(`
            SELECT * FROM Users 
            WHERE email = ? OR recoveryEmail = ?
        `, [email, email]);

        if (user.length === 0) {
            return res.status(404).json({ found: false });
        }

        res.json({ found: true, securityQuestion: user[0].securityQuestion });
    } catch (error) {
        console.error('Error recovering by email:', error);
        res.status(500).json({ message: 'Error recovering account.' });
    }
};

const sendOTP = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const expiry = new Date(Date.now() + 300000); // Valid for 5 minutes

        const [user] = await pool.query('SELECT * FROM Users WHERE phoneNumber = ?', [phoneNumber]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Phone number not found.' });
        }

        await pool.query('UPDATE Users SET otp = ?, otpExpiry = ? WHERE phoneNumber = ?', [otp, expiry, phoneNumber]);

        // Use an SMS service to send the OTP (e.g., Twilio)
        await sendSMS(phoneNumber, `Your OTP is: ${otp}`);

        res.json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP.' });
    }
};

const verifyOTP = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    try {
        const [user] = await pool.query(`
            SELECT * FROM Users 
            WHERE phoneNumber = ? AND otp = ? AND otpExpiry > NOW()
        `, [phoneNumber, otp]);

        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        res.json({ message: 'OTP verified successfully.', email: user[0].email });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP.' });
    }
};


// --- Verify Security Question Answer ---
const verifyAnswer = async (req, res) => {
    const { email, answer } = req.body;

    try {
        const [user] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isAnswerCorrect = await bcrypt.compare(answer, user[0].securityAnswer);
        if (isAnswerCorrect) {
            res.json({ correct: true });
        } else {
            res.status(400).json({ correct: false });
        }
    } catch (error) {
        console.error('Error verifying answer:', error);
        res.status(500).json({ message: 'Error verifying answer.' });
    }
};

// Export the functions
module.exports = {
    forgotPassword,
    resetPassword,
    recoverByKey,
    recoverByEmail,
    sendOTP,
    verifyOTP,
    verifyAnswer
};
