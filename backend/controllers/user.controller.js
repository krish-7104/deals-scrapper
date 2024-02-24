const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto=require('crypto');
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

// Forgot Password
// exports.forgotPassword = async (req, res) => {
//     const { email } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         // Generate a token for password reset
//         const resetToken = jwt.sign({ email }, 'secret', { expiresIn: '1h' });

//         // Send email with reset token
//         sendMail(user.email, resetToken);

//         res.json({ message: "Reset password link sent to your email" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

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

    const resetToken = new ResetToken({ userId: user._id, token });
    await resetToken.save();

    sendMail(user.email, token);

    return res.status(200).json({ message: 'Reset password email sent successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

if (!process.env.JWT_SECRET) {
  const randomBuffer = crypto.randomBytes(32); 
  process.env.JWT_SECRET = randomBuffer.toString('hex');
}
const JWT_SECRET = process.env.JWT_SECRET;

console.log('JWT Secret Key:', JWT_SECRET);


// Reset Password
// exports.resetPassword = async (req, res) => {
//     const { email, newPassword, resetToken } = req.body;

//     try {
//         jwt.verify(resetToken, 'secret', async (err, decoded) => {
//             if (err) {
//                 return res.status(400).json({ error: "Invalid or expired token" });
//             }

//             const user = await User.findOne({ email });
//             if (!user) {
//                 return res.status(404).json({ error: "User not found" });
//             }

//             // Update the password
//             const hashedPassword = await bcrypt.hash(newPassword, 10);
//             user.password = hashedPassword;
//             await user.save();

//             res.json({ message: "Password reset successfully" });
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

exports.updatePassword = async (req, res) => {
    const { token: resetTokenId, newPassword } = req.body;
  
    try {
      // Find reset token document in the database
      const resetTokenDoc = await ResetToken.findById(resetTokenId);
      if (!resetTokenDoc) {
        return res.status(404).json({ message: 'Reset token not found' });
      }
  
      // Verify the JWT token stored in the reset token document
      const { userId, token: jwtToken } = resetTokenDoc;
      try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        // If the token is valid, update the user's password with the new password
        const user = await User.findById(userId);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
  
        // Delete the reset token document from the database
        await ResetToken.findByIdAndDelete(resetTokenId);
  
        return res.status(200).json({ message: 'Password reset successfully' });
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Reset token has expired' });
        }
        return res.status(401).json({ message: 'Invalid reset token' });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


