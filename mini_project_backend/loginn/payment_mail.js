// payment_mail.js
const transporter = require("./mailer"); // shared nodemailer transporter
require("dotenv").config();

async function sendEmail(to, subject, text) {
  if (!to || !subject || !text) throw new Error("Invalid email parameters");

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log("Email sent to", to);
  } catch (err) {
    console.error("Error sending email to", to, err);
    throw err;
  }
}

module.exports = sendEmail;
