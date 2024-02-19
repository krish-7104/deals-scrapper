const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate a token for password reset
        const resetToken = jwt.sign({ email }, 'secret', { expiresIn: '1h' });

        // Send email with reset token
        sendMail(user.email, resetToken);

        res.json({ message: "Reset password link sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { email, newPassword, resetToken } = req.body;

    try {
        // Verify the reset token
        jwt.verify(resetToken, 'secret', async (err, decoded) => {
            if (err) {
                return res.status(400).json({ error: "Invalid or expired token" });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Update the password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            res.json({ message: "Password reset successfully" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


