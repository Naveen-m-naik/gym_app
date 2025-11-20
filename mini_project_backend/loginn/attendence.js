// loginn/attendence.js
const express = require("express");
const Attendance = require("./attendence_mod");
const authMiddleware = require("./authmiddle");

const router = express.Router();

// Fetch all attendance (optionally filter by dates)
router.get("/view", authMiddleware, async (req, res) => {
  const { from, to } = req.query;
  let filter = {};
  
  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    filter.date = { $gte: fromDate.toISOString().split("T")[0], $lte: toDate.toISOString().split("T")[0] };
  }

  try {
    const data = await Attendance.find(filter).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Search full attendance for a specific trainer
router.get("/search", authMiddleware, async (req, res) => {
  const { username } = req.query;

  try {
    const data = await Attendance.find({ username }).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
