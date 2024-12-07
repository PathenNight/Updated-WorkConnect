const Task = require('../models/Task'); // Updated path to the Task model

const createTask = async (req, res) => {
    const { taskName, taskDate, userId } = req.body;

    if (!taskName || !taskDate || !userId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Step 1: Create a new Task instance
        const newTask = new Task(taskName, taskDate, userId);

        // Step 2: Save the Task to the database
        await newTask.save();

        // Respond with success message
        res.status(201).json({
            message: 'Task created successfully.',
            task: {
                id: newTask.id,
                name: newTask.name,
                startDate: newTask.startDate,
                userId: newTask.userId,
            },
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task.' });
    }
};

module.exports = {
    createTask,
};
