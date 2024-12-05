const express = require('express');
const projectController = require('../controllers/projectController'); // Ensure this is correct
const router = express.Router();

// --- Project Routes ---

// Get all projects
router.get('/all', projectController.getAllProjects);

// Get project by ID
router.get('/:id', projectController.getProjectById);

// Create a new project
router.post('/create', projectController.createProject);

// Update a project by ID
router.put('/update/:id', projectController.updateProject);

// Delete a project by ID
router.delete('/delete/:id', projectController.deleteProject);

module.exports = router;
