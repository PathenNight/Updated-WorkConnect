const pool = require('../config/db'); // Database connection

class User {
    constructor(id = null, email, firstName = '', lastName = '', role = 'employee') {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role; // Default to 'employee'
    }

    // --- Getter and Setter Methods ---
    setID(newID) {
        this.id = newID;
    }

    getID() {
        return this.id;
    }

    setEmail(newEmail) {
        this.email = newEmail;
    }

    getEmail() {
        return this.email;
    }

    setFirstName(newFirstName) {
        this.firstName = newFirstName;
    }

    getFirstName() {
        return this.firstName;
    }

    setLastName(newLastName) {
        this.lastName = newLastName;
    }

    getLastName() {
        return this.lastName;
    }

    setRole(newRole) {
        this.role = newRole;
    }

    getRole() {
        return this.role;
    }

    // --- Database Operations ---

    /**
     * Save a new user to the database.
     * Throws an error if required fields are missing.
     */
    async save() {
        if (!this.email || !this.firstName || !this.lastName) {
            throw new Error('Email, first name, and last name are required.');
        }

        try {
            const sql = `
                INSERT INTO Users (email, firstName, lastName, role)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await pool.query(sql, [this.email, this.firstName, this.lastName, this.role]);
            this.id = result.insertId; // Assign the generated ID
        } catch (err) {
            console.error('Error saving user:', err);
            throw new Error('Database error: Unable to save user.');
        }
    }

    /**
     * Fetch a user by ID.
     * @param {number} userID - The ID of the user.
     * @returns {User|null} - The user object or null if not found.
     */
    static async getByID(userID) {
        try {
            const sql = `SELECT * FROM Users WHERE id = ?`;
            const [rows] = await pool.query(sql, [userID]);
            if (rows.length === 0) return null;

            const { id, email, firstName, lastName, role } = rows[0];
            return new User(id, email, firstName, lastName, role);
        } catch (err) {
            console.error('Error fetching user by ID:', err);
            throw new Error('Database error: Unable to fetch user by ID.');
        }
    }

    /**
     * Fetch a user by email.
     * @param {string} email - The email of the user.
     * @returns {User|null} - The user object or null if not found.
     */
    static async getByEmail(email) {
        try {
            const sql = `SELECT * FROM Users WHERE email = ?`;
            const [rows] = await pool.query(sql, [email]);
            if (rows.length === 0) return null;

            const { id, email: userEmail, firstName, lastName, role } = rows[0];
            return new User(id, userEmail, firstName, lastName, role);
        } catch (err) {
            console.error('Error fetching user by email:', err);
            throw new Error('Database error: Unable to fetch user by email.');
        }
    }

    /**
     * Update a user's information.
     * Throws an error if the user ID is not set.
     */
    async update() {
        if (!this.id) {
            throw new Error('User ID is required to update user.');
        }

        try {
            const sql = `
                UPDATE Users
                SET email = ?, firstName = ?, lastName = ?, role = ?
                WHERE id = ?
            `;
            await pool.query(sql, [this.email, this.firstName, this.lastName, this.role, this.id]);
        } catch (err) {
            console.error('Error updating user:', err);
            throw new Error('Database error: Unable to update user.');
        }
    }

    /**
     * Delete a user from the database.
     * Throws an error if the user ID is not set.
     */
    async delete() {
        if (!this.id) {
            throw new Error('User ID is required to delete user.');
        }

        try {
            const sql = `DELETE FROM Users WHERE id = ?`;
            await pool.query(sql, [this.id]);
        } catch (err) {
            console.error('Error deleting user:', err);
            throw new Error('Database error: Unable to delete user.');
        }
    }
}

module.exports = User;
