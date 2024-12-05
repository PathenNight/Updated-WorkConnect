const User = require('./User'); // Import User class
const pool = require('../config/db'); // Import database connection

class Employee extends User {
    constructor(id, email, firstName, lastName, role = 'employee', isAdmin = false, managerID = null) {
        super(id, email, firstName, lastName, role); // Call User constructor
        this.isAdmin = isAdmin;
        this.managerID = managerID;
    }

    // Getter and Setter for Manager ID
    getManagerID() {
        return this.managerID;
    }

    setManagerID(managerID) {
        this.managerID = managerID;
    }

    // Getter and Setter for isAdmin
    getIsAdmin() {
        return this.isAdmin;
    }

    setIsAdmin(isAdmin) {
        this.isAdmin = isAdmin;
    }

    // Save employee to the database
    async save() {
        // Save as a User first
        if (!this.id) {
            await super.save(); // Use User's save method to generate the user ID
        }

        const sql = `
            INSERT INTO Employees (userID, isAdmin, managerID)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE isAdmin = VALUES(isAdmin), managerID = VALUES(managerID)
        `;
        await pool.query(sql, [this.id, this.isAdmin, this.managerID]);
    }

    // Fetch an employee by user ID
    static async getByUserID(userID) {
        const sql = `
            SELECT u.id, u.email, u.firstName, u.lastName, u.role, e.isAdmin, e.managerID
            FROM Users u
            LEFT JOIN Employees e ON u.id = e.userID
            WHERE u.id = ?
        `;
        const [rows] = await pool.query(sql, [userID]);
        if (rows.length === 0) {
            return null;
        }

        const { id, email, firstName, lastName, role, isAdmin, managerID } = rows[0];
        return new Employee(id, email, firstName, lastName, role, isAdmin, managerID);
    }

    // Assign a task to this employee
    async assignTask(taskID) {
        const sql = `UPDATE Tasks SET assignedTo = ? WHERE id = ?`;
        await pool.query(sql, [this.id, taskID]);
    }
}

module.exports = Employee;
