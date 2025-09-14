// routes/attendanceRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Attendance = require("./attendence_mod"); // adjust path to your model

const router = express.Router();

// 📌 Mark attendance
router.post("/mark", async (req, res) => {
  try {
    // 🔐 Get token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    // 🔎 Verify token
    const decoded = jwt.verify(token, "mySecretKey"); // use process.env.JWT_SECRET in production
    const username = decoded.username;

    // 🗓️ Get today's date (India timezone)
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    // 🚫 Prevent duplicate attendance for same day
    const existing = await Attendance.findOne({ username, date: today });
    if (existing) {
      return res.status(400).json({ message: "Already marked for today" });
    }

    // ✅ Save attendance
    const record = new Attendance({
      username,
      date: today,
      status: "Present",
    });
    await record.save();

    res.json({ message: "Attendance marked successfully" });
  } catch (err) {
    console.error("❌ Attendance Error:", err);
    res.status(500).json({ message: "Error marking attendance" });
  }
});

module.exports = router;
