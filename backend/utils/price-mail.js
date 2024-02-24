const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
});


exports.priceMail = async (userEmail, productUrl, data) => {
  try {
    const mailOptions = {
      from: `Deals Scrapper ${process.env.NODEMAILER_USER}`,
      to: userEmail,
      subject: 'Price Alert: Buy now!!',
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Price Drop Notification</title>
          <style>
              /* Reset CSS */
              body, h1, h2, h3, h4, h5, h6, p, ul, ol, li {
                  margin: 0;
                  padding: 0;
              }
      
              body {
                  background-color: #f4f4f4;
                  color: #333;
              }
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
      
              .product-card {
                  background-color: #fff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  margin-bottom: 20px;
              }
      
              .product-image {
                  width: 100%;
                  height: auto;
                  border-bottom: 1px solid #eee;
              }
      
              .product-details {
                  padding: 20px;
              }
      
              .product-name {
                  font-size: 1.2rem;
                  font-weight: 600;
                  margin-bottom: 10px;
              }
      
              .product-price {
                  font-size: 1.1rem;
                  font-weight: 600;
                  color: #e11d48;
                  margin-bottom: 10px;
              }
      
              .product-discount, .product-original-price {
                  font-size: 1rem;
                  margin-bottom: 10px;
              }
              .open-product-button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #e11d48;
                color: #fff;
                text-decoration: none;
                border-radius: 4px;
                transition: background-color 0.3s ease;
            }

            .open-product-button,
            .open-product-button:hover,
            .open-product-button:visited,
            .open-product-button:focus {
                color: #fff;
            }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="product-card">
                  <img src='${data.image}' alt="Product Image" class="product-image">
                  <div class="product-details">
                      <h2 class="product-name">${data.name}</h2>
                      <p class="product-price">Discount Price: ${data.discount_price}</p>
                      <p class="product-original-price">Original Price: ${data.original_price}</p>
                      <p class="product-discount">Discount: ${data.discount}%</p>
                      <a href="${productUrl}" class="open-product-button">View Product</a>
                  </div>
              </div>
          </div>
      </body>
      </html>`    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
