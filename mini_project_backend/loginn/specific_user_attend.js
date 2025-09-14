const express = require("express");
const Attendance = require("./attendence_mod");
const jwt = require("jsonwebtoken");

const router = express.Router();

// ✅ Get logged-in user's attendance
router.get("/my-attendance", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    // Use SAME secret as in login
    const decoded = jwt.verify(token, "mySecretKey");

    const username = decoded.username;
    if (!username) {
      return res.status(400).json({ error: "Invalid token payload" });
    }

    const records = await Attendance.find({ username }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error("Attendance fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

module.exports = router;
