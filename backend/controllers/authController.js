const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { fullname, email, password }
        =req.body;

        const existingUser = await User.findOne ({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullname,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'Register Successfully',
        });
    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } =req.body;

        const user = await User.findOne({
            email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            });

            res.json({
            success: true,
            token,

            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
       res.status(500).json({
        message:error.message
       }); 
    }
};