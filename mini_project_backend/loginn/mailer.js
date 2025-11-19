// loginn/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config({ path: __dirname + "/../.env" }); // load env from project root

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // must be App Password
  },
});

transporter.verify((err, success) => {
  if (err) console.error("Mailer verification failed:", err);
  else console.log("Mailer ready to send emails");
});

module.exports = transporter;
