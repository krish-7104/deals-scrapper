const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER, 
    pass: process.env.NODEMAILER_PASS 
  }
});


exports.priceMail = async (userEmail, productUrl) => {
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_USER, 
      to: userEmail, 
      subject: 'Price Alert: Buy now!!',
      text: `The price of your product (${productUrl}) is lower than your desired price. Buy now!`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
