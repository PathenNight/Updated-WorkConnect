const pool = require('../config/db');

const createProject = async (req, res) => {
    const { name, deadline } = req.body;

    try {
        const sql = 'INSERT INTO Projects (name, deadline) VALUES (?, ?)';
        const [result] = await pool.query(sql, [name, deadline]);
        res.status(201).json({ message: 'Project created successfully', projectID: result.insertId });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project' });
    }
};

const getAllProjects = async (req, res) => {
    try {
        const sql = 'SELECT * FROM Projects';
        const [projects] = await pool.query(sql);
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

const getProjectById = async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'SELECT * FROM Projects WHERE projectID = ?';
        const [project] = await pool.query(sql, [id]);
        if (!project.length) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project[0]);
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        res.status(500).json({ message: 'Error fetching project by ID' });
    }
};

const updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, deadline } = req.body;

    try {
        const sql = 'UPDATE Projects SET name = ?, deadline = ? WHERE projectID = ?';
        await pool.query(sql, [name, deadline, id]);
        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project' });
    }
};

const deleteProject = async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'DELETE FROM Projects WHERE projectID = ?';
        await pool.query(sql, [id]);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project' });
    }
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
};
