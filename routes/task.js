const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();

router.post('/create', taskController.createTask);

module.exports = router;
