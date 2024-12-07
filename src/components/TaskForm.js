import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is installed
import '../styles/TaskForm.css'; // Import CSS for styling

const TaskForm = ({ onTaskCreated }) => {
    const [taskName, setTaskName] = useState('');
    const [deadline, setDeadline] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [projectId, setProjectId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!taskName || !deadline || !assignedTo) {
            setErrorMessage('All fields are required.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/tasks/create`, {
                name: taskName,
                deadline,
                assignedTo,
                projectId,
              });
              

            setSuccessMessage('Task created successfully!');
            setErrorMessage('');
            setTaskName('');
            setDeadline('');
            setAssignedTo('');
            setProjectId('');
            if (onTaskCreated) {
                onTaskCreated(response.data); // Notify parent about the new task
            }
        } catch (error) {
            console.error('Error creating task:', error);
            setErrorMessage('Failed to create task.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="task-form-container">
            <h2>Create a Task</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="taskName">Task Name:</label>
                    <input
                        type="text"
                        id="taskName"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="Enter task name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="deadline">Deadline:</label>
                    <input
                        type="date"
                        id="deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="assignedTo">Assign To:</label>
                    <input
                        type="text"
                        id="assignedTo"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        placeholder="Enter user ID"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="projectId">Project ID (Optional):</label>
                    <input
                        type="text"
                        id="projectId"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        placeholder="Enter project ID"
                    />
                </div>
                <button type="submit" className="submit-button">
                    Create Task
                </button>
            </form>
        </div>
    );
};

export default TaskForm;
