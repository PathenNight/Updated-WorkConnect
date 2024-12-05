const pool = require('../config/db'); // Use the shared database connection pool

const authorizeRole = (allowedRoles) => {
    return async (req, res, next) => {
        const userId = req.headers['user-id']; // Assuming user ID is passed in the request headers
        if (!userId) {
            return res.status(401).json({ message: 'User ID is required for authorization' });
        }

        try {
            // Retrieve user from the database
            const [user] = await pool.query('SELECT role FROM Users WHERE id = ?', [userId]);
            if (user.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userRole = user[0].role;
            if (!allowedRoles.includes(userRole)) {
                console.error(`Access denied for user ID ${userId} with role ${userRole}`);
                return res.status(403).json({ message: 'Access denied: insufficient role' });
            }

            // User is authorized
            next();
        } catch (error) {
            console.error('Error authorizing role:', error);
            res.status(500).json({ message: 'Internal server error during role authorization' });
        }
    };
};

module.exports = authorizeRole;
