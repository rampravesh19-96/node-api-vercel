const nodemailer = require("nodemailer");
require("dotenv").config();
console.log(process.env.FROM_EMAIL_PASSWORD);
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.FROM_EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to,
      subject,
      text,
    };
    const info = await transporter.sendMail(mailOptions);

    return info.response;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail