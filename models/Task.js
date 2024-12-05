const Activity = require('./Activity'); // Import Activity base class
const pool = require('../config/db'); // Import database connection

class Task extends Activity {
    constructor(newTaskName = "Unnamed Task", newProjectName = null, newDeadline = null) {
        super(newTaskName, null, newDeadline); // Call Activity constructor
        this.baseProjectID = null; // Link to a parent project
    }

    // Getter and setter for the base project ID
    setActivityProject(newBaseProjectID) {
        this.baseProjectID = newBaseProjectID;
    }

    getBaseProject() {
        return this.baseProjectID;
    }

    // Save the task to the database
    async save() {
        const sql = 'INSERT INTO Tasks (name, startDate, deadline, baseProjectID) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(sql, [this.name, this.startDate, this.deadline, this.baseProjectID]);
        this.id = result.insertId; // Assign the generated database ID
    }
}

module.exports = Task; // Export the class
