const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const authmiddle = require("./authmiddle");
require("dotenv").config({ path: __dirname + "/../.env" });

// POST /email/send-trainer-email
router.post("/send-trainer-email", authmiddle, async (req, res) => {
  const { to, subject, message } = req.body;
  console.log("DEBUG: Email request body:", req.body);

  if (!to || !subject || !message) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("Mailer ready to send emails");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    });

    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Email sent successfully", info: info.response });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Error sending email", error: err.message });
  }
});

module.exports = router;
