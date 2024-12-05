const User = require('../models/User');

// Create a new user
exports.createUser = async (req, res) => {
    const { email, firstName, lastName, role } = req.body;

    try {
        const user = new User(null, email, firstName, lastName, role || 'employee');
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

// Get a user by ID
exports.getUserByID = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.getByID(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};
