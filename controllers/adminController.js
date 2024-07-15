const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const bcrypt = require('bcrypt');

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ where: { username } });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ username: admin.username, role: "admin" }, process.env.JWT_SECRET);

        res.json({ token });
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addAdmin = async (req, res) => {
    const { username, password, key } = req.body;

    try {
        if (key !== process.env.KEY_ADD_ADMIN) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const existingAdmin = await Admin.findOne({ where: { username } });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with that username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newAdmin = await Admin.create({
            username,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'Admin added successfully' });
    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).json({ message: 'Failed to add admin' });
    }
};

module.exports = {
    loginAdmin,
    addAdmin,
};
