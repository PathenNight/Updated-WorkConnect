const Activity = require('./Activity'); // Import Activity base class
const pool = require('../config/db'); // Import database connection

class Task extends Activity {
    constructor(newTaskName = "Unnamed Task", newDeadline = null, userId = null, baseProjectID = null) {
        super(newTaskName, userId, newDeadline); // Call Activity constructor
        this.baseProjectID = baseProjectID; // Link to a parent project
    }

    // Getter and setter for the base project ID
    setBaseProject(newBaseProjectID) {
        this.baseProjectID = newBaseProjectID;
    }

    getBaseProject() {
        return this.baseProjectID;
    }

    // Save the task to the database
    async save() {
        try {
            // Step 1: Save the activity base class data
            const activitySql = 'INSERT INTO Activities (name, date, userId) VALUES (?, ?, ?)';
            const [activityResult] = await pool.query(activitySql, [this.name, this.startDate, this.userId]);
            this.id = activityResult.insertId; // Assign the generated database ID

            // Step 2: Save the task-specific data
            const taskSql = 'INSERT INTO Tasks (activityId, baseProjectID) VALUES (?, ?)';
            await pool.query(taskSql, [this.id, this.baseProjectID]);
        } catch (error) {
            console.error('Error saving task:', error);
            throw error;
        }
    }

    // Fetch all tasks by user ID
    static async fetchByUserId(userId) {
        try {
            const sql = `
                SELECT Activities.*, Tasks.baseProjectID 
                FROM Activities 
                JOIN Tasks ON Activities.id = Tasks.activityId 
                WHERE Activities.userId = ?`;
            const [rows] = await pool.query(sql, [userId]);
            return rows;
        } catch (error) {
            console.error('Error fetching tasks by userId:', error);
            throw error;
        }
    }
}

module.exports = Task; // Export the class
