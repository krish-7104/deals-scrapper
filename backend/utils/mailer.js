const nodemailer = require('nodemailer');
const {user,pass}=require("./../mailAccount");

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user,
        pass: pass
    }
});

// Function to send email
exports.sendMail = (to, token) => {
    const mailOptions = {
        from: 'hunnygandhi274@gmail.com',
        to,
        subject: 'Password Reset',
        text: `Reset your password by clicking on the following link: http://localhost:4000/api/v1/user/resetPassword?token=${token}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
