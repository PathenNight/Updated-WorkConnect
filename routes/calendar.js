const express = require('express');
const Calendar = require('../models/Calendar'); // Import Calendar model
const router = express.Router();

// Get all calendar events (tasks + projects) by month and year
router.get('/:year/:month', async (req, res) => {
    const { year, month } = req.params;

    try {
        const events = await Calendar.getEventsByMonth(parseInt(year), parseInt(month));
        res.status(200).json(events);
    } catch (err) {
        console.error('Error fetching calendar data:', err);
        res.status(500).json({ message: 'Failed to fetch calendar data' });
    }
});

// Get all events for a specific day
router.get('/:year/:month/:day', async (req, res) => {
    const { year, month, day } = req.params;

    try {
        const events = await Calendar.getEventsByDay(parseInt(year), parseInt(month), parseInt(day));
        res.status(200).json(events);
    } catch (err) {
        console.error('Error fetching daily data:', err);
        res.status(500).json({ message: 'Failed to fetch daily data' });
    }
});

// Add a new calendar event
router.post('/create', async (req, res) => {
    const { eventName, eventDate, eventDescription } = req.body;

    try {
        await Calendar.addEvent(eventName, eventDate, eventDescription);
        res.status(201).json({ message: 'Event created successfully' });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ message: 'Error creating event' });
    }
});

module.exports = router;
