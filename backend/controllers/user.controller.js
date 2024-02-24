const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ResetToken = require('../models/resetToken.model');
const { sendMail } = require('../utils/reset-mail.js');

exports.register = async (req, res) => {
    let { name, email, password } = req.body;

    try {
        // Validation checks
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.status(400).json({
                status: false,
                message: "Invalid email entered"
            });
        }

        if (!name || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "Empty input fields!"
            });
        }

        if (typeof name !== 'string') {
            return res.status(400).json({
                status: false,
                message: "Name must be a string"
            });
        }

        email = email.trim();
        password = password.trim();


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "User already exists"
            });
        }

        // Hash password and save user

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        const result = await newUser.save();
        let resultObject = result.toObject();
        delete resultObject.password;

        res.status(201).json({
            status: true,
            message: "Register Successful",
            data: resultObject
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "An error occurred while registering user"
        });
    }
};

exports.login = async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    try {
        if (email === "" || password === "") {
            return res.status(400).json({
                status: false,
                message: "Empty credential supplied!"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found!"
            });
        }

        const hashedPassword = user.password;
        const match = await bcrypt.compare(password, hashedPassword);

        let resultObject = user.toObject();
        delete resultObject.password;

        if (match) {
            const jwtToken = jwt.sign({ ...resultObject }, 'SECRET_LOGIN', { expiresIn: '7d' });
            return res.json({
                status: true,
                message: "Login Successful",
                token: jwtToken
            });
        } else {
            return res.status(401).json({
                status: false,
                message: "Invalid password entered!"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "An error occurred while logging in"
        });
    }
};

exports.user = async (req, res) => {
    try {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(' ')[1];
            jwt.verify(bearerToken, 'SECRET_LOGIN', (err, authData) => {
                if (err) {
                    res.status(401).json({ message: "Unauthorized User", success: false });
                } else {
                    res.json({
                        success: true,
                        data: authData,
                        message: "User Authorized"
                    });
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = generateToken(user._id);
        const resetToken = new ResetToken({ token });
        await resetToken.save();
        sendMail(user.email, resetToken._id);
        return res.status(200).json({ message: 'Reset password email sent' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


exports.updatePassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        if (!token) {
            return res.status(404).json({ message: 'Token not found' });
        }
        const resetTokenData = await ResetToken.findById(token)
        if (!resetTokenData) {
            return res.status(404).json({ message: 'Token not found' });
        }
        try {
            // Verify the token
            const tokenData = jwt.verify(resetTokenData.token, process.env.JWT_SECRET);

            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update user password
            await User.findByIdAndUpdate(tokenData.userId, { password: hashedPassword });

            // Delete reset token
            await ResetToken.findByIdAndDelete(token);

            return res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error verifying JWT:', error);
            return res.status(401).json({ message: 'Invalid Token' });
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

