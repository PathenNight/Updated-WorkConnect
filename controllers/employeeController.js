const Employee = require('../models/Employee');

exports.getEmployeeByID = async (req, res) => {
    const { userID } = req.params;
    try {
        const employee = await Employee.getByUserID(userID);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching employee' });
    }
};
