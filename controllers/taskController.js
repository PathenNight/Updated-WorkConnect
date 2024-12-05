const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
    const { name, startDate, deadline, projectID } = req.body;

    try {
        const task = new Task(name, null, deadline);
        task.setActivityProject(projectID); // Link task to a project
        await task.save();

        const project = new Project(); // Fetch or initialize the project
        project.addTask(task.id);
        await project.save(); // Save project with updated task list

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating task' });
    }
};
