const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Shared connection pool
const { validateInput } = require('../utils/validation'); // Custom validation utility
const saltRounds = 10;

const crypto = require('crypto'); // To generate a unique recovery key

// --- User Registration ---
const register = async (req, res) => {
    const { email, recoveryEmail, phoneNumber, firstName, lastName, password, role, securityQuestion, securityAnswer } = req.body;

    try {
        // Validate required fields
        const validationErrors = validateInput({
            email,
            firstName,
            lastName,
            password,
            securityQuestion,
            securityAnswer,
        });
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        // Check if user already exists
        const [existingUser] = await pool.query('SELECT * FROM Users WHERE email = ? OR recoveryEmail = ?', [
            email,
            recoveryEmail,
        ]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Email or recovery email already exists.' });
        }

        // Hash password and security answer
        const hashedPassword = await bcrypt.hash(password, 10); // Replace saltRounds with 10 if it's undefined
        const hashedAnswer = await bcrypt.hash(securityAnswer, 10);

        // Generate recovery key
        const recoveryKey = crypto.randomBytes(16).toString('hex');

        // Insert new user
        const sql = `
            INSERT INTO Users (email, recoveryEmail, phoneNumber, firstName, lastName, password, role, securityQuestion, securityAnswer, recoveryKey)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(sql, [
            email,
            recoveryEmail || null,
            phoneNumber || null,
            firstName,
            lastName,
            hashedPassword,
            role || 'employee',
            securityQuestion,
            hashedAnswer,
            recoveryKey,
        ]);

        res.status(201).json({
            message: 'User registered successfully.',
            recoveryKey, // Optionally return the recovery key
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user.' });
    }
};

// --- User Login ---
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const [user] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user[0].password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Respond with user details
        res.json({
            message: 'Login successful.',
            user: { id: user[0].id, email: user[0].email, role: user[0].role }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in.' });
    }
};

// --- Logout ---
const logout = async (req, res) => {
    // Without JWT, logout can simply be a client-side action (e.g., clearing session data).
    res.status(200).json({ message: 'Logout successful.' });
};

// --- Security Questions ---
const getSecurityQuestions = (req, res) => {
    const questions = require('../config/securityQuestions'); // Import from config
    res.json({ questions });
};

// --- Update User ---
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;

    try {
        const [user] = await pool.query('SELECT * FROM Users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : user[0].password;

        const sql = `
            UPDATE Users
            SET firstName = ?, lastName = ?, email = ?, password = ?
            WHERE id = ?
        `;
        await pool.query(sql, [firstName || user[0].firstName, lastName || user[0].lastName, email || user[0].email, hashedPassword, id]);

        res.status(200).json({ message: 'User updated successfully.' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user.' });
    }
};

module.exports = {
    register,
    login,
    logout,
    getSecurityQuestions,
    updateUser,
};
