const nodemailer = require("nodemailer");

const config = require("../config.json")
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.from_email,
    pass: config.from_email_password,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: config.from_email,
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