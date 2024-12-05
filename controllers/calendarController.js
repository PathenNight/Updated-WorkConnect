const Calendar = require('../models/Calendar');

exports.getMonthlyCalendar = async (req, res) => {
    const { year, month } = req.params;

    try {
        const calendar = new Calendar();
        const data = await calendar.getCalendarData(parseInt(year), parseInt(month));

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating calendar' });
    }
};
