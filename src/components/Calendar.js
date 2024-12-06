import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Calendar.css'; // Import the CSS file

const Calendar = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [calendarData, setCalendarData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Fetch calendar data from the backend
    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                const response = await axios.get(
                    `/api/calendar/${currentYear}/${currentMonth + 1}`
                );
                setCalendarData(response.data);
            } catch (error) {
                console.error('Error fetching calendar data:', error);
            }
        };

        fetchCalendarData();
    }, [currentYear, currentMonth]);

    const handleDateClick = (day) => {
        setSelectedDate(day);
        const tasksForDay = calendarData.filter(
            (item) =>
                new Date(item.event_date).toDateString() ===
                new Date(currentYear, currentMonth, day).toDateString()
        );
        setTasks(tasksForDay);
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((prev) => prev + 1);
        } else {
            setCurrentMonth((prev) => prev + 1);
        }
    };

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((prev) => prev - 1);
        } else {
            setCurrentMonth((prev) => prev - 1);
        }
    };

    const generateCalendarDays = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = selectedDate === day;
            const tasksForDay = calendarData.filter(
                (item) =>
                    new Date(item.event_date).toDateString() ===
                    new Date(currentYear, currentMonth, day).toDateString()
            );

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDateClick(day)}
                >
                    <span className="day-number">{day}</span>
                    {tasksForDay.length > 0 && (
                        <div className="task-count-circle">{tasksForDay.length}</div>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button className="nav-button" onClick={handlePreviousMonth}>
                    &lt;
                </button>
                <div className="month-year">
                    {new Date(currentYear, currentMonth).toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </div>
                <button className="nav-button" onClick={handleNextMonth}>
                    &gt;
                </button>
            </div>

            <div className="days-of-week">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="header-day">
                        {day}
                    </div>
                ))}
            </div>

            <div className="calendar-grid">{generateCalendarDays()}</div>

            {selectedDate && (
                <div className="task-list">
                    <h3>Tasks for {selectedDate}</h3>
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <div key={index} className="task-item">
                                {task.event_name}
                            </div>
                        ))
                    ) : (
                        <p>No tasks for this day.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Calendar;
