const express = require('express');
const employeeController = require('../controllers/employeeController');
const router = express.Router();

router.get('/:userID', employeeController.getEmployeeByID);

module.exports = router;
