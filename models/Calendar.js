const pool = require('../config/db'); // Database connection

class Calendar {
    // Add a new event
    static async addEvent(eventName, eventDate, eventDescription) {
        const sql = `
            INSERT INTO Calendar (event_name, event_date, event_description)
            VALUES (?, ?, ?)
        `;
        await pool.query(sql, [eventName, eventDate, eventDescription]);
    }

    // Get all events for a specific month
    static async getEventsByMonth(year, month) {
        const sql = `
            SELECT * FROM Calendar
            WHERE YEAR(event_date) = ? AND MONTH(event_date) = ?
            ORDER BY event_date ASC
        `;
        const [rows] = await pool.query(sql, [year, month]);
        return rows;
    }

    // Get all events for a specific day
    static async getEventsByDay(year, month, day) {
        const sql = `
            SELECT * FROM Calendar
            WHERE event_date = ?
        `;
        const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const [rows] = await pool.query(sql, [date]);
        return rows;
    }
}

module.exports = Calendar;
