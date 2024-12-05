const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',   // Use environment variables for flexibility
    user: process.env.DB_USER || 'root',       // Database username
    password: process.env.DB_PASSWORD || 'password', // Database password
    database: process.env.DB_NAME || 'WorkConnectDB', // Database name
    waitForConnections: true,                  // Wait for available connection before throwing an error
    connectionLimit: 10,                       // Maximum number of connections in the pool
    queueLimit: 0                              // No limit on queued connection requests
});

// Export the pool for use in other files
module.exports = pool;