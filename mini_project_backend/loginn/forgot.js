const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./client_model");
const Trainer = require("./mod_trainer");
const transporter = require("./mailer"); // ✅ use shared transporter
require("dotenv").config();

const router = express.Router();

async function findAccount(username) {
  let account = await User.findOne({ username }).select("+resetCode +resetCodeExpire");
  if (account) return { account, type: "User" };

  account = await Trainer.findOne({ username }).select("+resetCode +resetCodeExpire");
  if (account) return { account, type: "Trainer" };

  return null;
}

// 1️⃣ Send Code
router.post("/send-code", async (req, res) => {
  const { username } = req.body;

  try {
    const result = await findAccount(username);
    if (!result) return res.status(400).json({ message: "Account not found" });

    const { account, type } = result;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    account.resetCode = code;
    account.resetCodeExpire = Date.now() + 15 * 60 * 1000; // 15 min
    await account.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: account.email,
      subject: "Password Reset Code",
      text: `Your reset code is: ${code}`,
    });

    res.json({ message: `${type} code sent to email` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending code" });
  }
});

// 2️⃣ Verify Code
router.post("/verify-code", async (req, res) => {
  const { username, code } = req.body;

  try {
    const result = await findAccount(username);
    if (!result)
      return res.status(400).json({ success: false, message: "Account not found" });

    const { account } = result;

    if (String(account.resetCode) !== String(code))
      return res.status(400).json({ success: false, message: "Invalid code" });

    if (account.resetCodeExpire && account.resetCodeExpire < Date.now())
      return res.status(400).json({ success: false, message: "Expired code" });

    account.resetCode = undefined;
    account.resetCodeExpire = undefined;
    await account.save();

    return res.json({ success: true, message: "Code verified" });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ message: "Error verifying code" });
  }
});

// 3️⃣ Change Password
router.post("/change-password", async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    const result = await findAccount(username);
    if (!result)
      return res.status(400).json({ success: false, message: "Account not found" });

    const { account, type } = result;

    account.password = newPassword;
    account.resetCode = undefined;
    account.resetCodeExpire = undefined;

    await account.save(); // pre-save hash will work

    res.json({ success: true, message: `${type} password changed successfully` });
  } catch (err) {
    console.error("Change-password error:", err);
    res.status(500).json({ success: false, message: "Error changing password" });
  }
});

module.exports = router;
