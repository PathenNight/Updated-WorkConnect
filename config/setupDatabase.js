const pool = require('./db'); // Use the connection pool

async function createTables() {
    try {
        console.log('Creating tables...');

        // --- Users Table ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                recoveryEmail VARCHAR(100) DEFAULT NULL,
                phoneNumber VARCHAR(15) DEFAULT NULL,
                firstName VARCHAR(100) NOT NULL,
                lastName VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('employee', 'manager', 'admin') DEFAULT 'employee',
                recoveryKey VARCHAR(255) DEFAULT NULL,
                securityQuestion VARCHAR(255),
                securityAnswer VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        // --- RefreshTokens Table ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS RefreshTokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userID INT NOT NULL,
                token TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userID) REFERENCES Users(id) ON DELETE CASCADE
            )
        `);

        // --- Projects Table ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Projects (
                projectID INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                deadline DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // --- Tasks Table ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Tasks (
                taskID INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                projectID INT,
                assignedTo INT,
                deadline DATE,
                FOREIGN KEY (projectID) REFERENCES Projects(projectID) ON DELETE CASCADE,
                FOREIGN KEY (assignedTo) REFERENCES Users(id) ON DELETE SET NULL
            )
        `);

        // --- Calendar Table ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Calendar (
                id INT AUTO_INCREMENT PRIMARY KEY,
                event_date DATE NOT NULL,
                event_name VARCHAR(255) NOT NULL,
                event_description TEXT
            )
        `);

        // --- Activity Log Table ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ActivityLog (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userID INT,
                activityType VARCHAR(255) NOT NULL,
                description TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userID) REFERENCES Users(id) ON DELETE SET NULL
            )
        `);

        // --- Notifications Table ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                recipientID INT NOT NULL,
                message TEXT NOT NULL,
                isRead BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (recipientID) REFERENCES Users(id) ON DELETE CASCADE
            )
        `);

        // --- Comments Table ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                taskID INT,
                userID INT,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (taskID) REFERENCES Tasks(taskID) ON DELETE CASCADE,
                FOREIGN KEY (userID) REFERENCES Users(id) ON DELETE SET NULL
            )
        `);

        // --- Teams Table ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Teams (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // --- Team Members Table ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS TeamMembers (
                teamID INT NOT NULL,
                userID INT NOT NULL,
                PRIMARY KEY (teamID, userID),
                FOREIGN KEY (teamID) REFERENCES Teams(id) ON DELETE CASCADE,
                FOREIGN KEY (userID) REFERENCES Users(id) ON DELETE CASCADE
            )
        `);

        // --- Team Projects Table ---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS TeamProjects (
                teamID INT NOT NULL,
                projectID INT NOT NULL,
                PRIMARY KEY (teamID, projectID),
                FOREIGN KEY (teamID) REFERENCES Teams(id) ON DELETE CASCADE,
                FOREIGN KEY (projectID) REFERENCES Projects(projectID) ON DELETE CASCADE
            )
        `);

        // ---Messages Table---
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Messages (
                messageID INT AUTO_INCREMENT PRIMARY KEY,
                senderID INT,
                recipientID INT,
                messageContents TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (senderID) REFERENCES Users(id) ON DELETE SET NULL,
                FOREIGN KEY (recipientID) REFERENCES Users(id) ON DELETE SET NULL
            )
        `);
        

        console.log('All tables created successfully.');
    } catch (err) {
        console.error('Error creating tables:', err.message, err.stack);
        throw err; // Let the calling code handle the error
    }
}

module.exports = createTables;

// Optional: Run this script directly
if (require.main === module) {
    createTables()
        .then(() => {
            console.log('Database setup completed.');
        })
        .catch((err) => {
            console.error('Error setting up database:', err);
        });
}
