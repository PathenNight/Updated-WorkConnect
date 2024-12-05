const Activity = require('./Activity'); // Import Activity base class
const pool = require('../config/db'); // Import database connection

class Project extends Activity {
    constructor(newProjectName = "Unnamed Project", newDeadline = null) {
        super(newProjectName, null, newDeadline); // Call Activity constructor
        this.derivedTaskIDs = []; // Array of linked task IDs
    }

    // Getter and setter for derived task IDs
    setSubactivities(newTaskIDs = []) {
        this.derivedTaskIDs = Array.isArray(newTaskIDs) ? newTaskIDs : [];
    }

    getDerivedTasks() {
        return this.derivedTaskIDs;
    }

    // Save the project to the database
    async save() {
        const sql = 'INSERT INTO Projects (name, startDate, deadline) VALUES (?, ?, ?)';
        const [result] = await pool.query(sql, [this.name, this.startDate, this.deadline]);
        this.id = result.insertId; // Assign the generated database ID
    }

    // Add a task to the project
    addTask(taskID) {
        if (!this.derivedTaskIDs.includes(taskID)) {
            this.derivedTaskIDs.push(taskID);
        }
    }
}

module.exports = Project; // Export the class
