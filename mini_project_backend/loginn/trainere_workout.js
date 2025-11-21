// loginn/trainer_workout.js
const express = require("express");
const Workout = require("./workout");
const User = require("./client_model");
const authMiddleware = require("./authmiddle");

const router = express.Router();

// Fetch all workouts with optional filters (username, date range)
router.get("/view", authMiddleware, async (req, res) => {
  const { username, from, to } = req.query;

  try {
    let filter = {};

    // Filter by date range
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      filter.date = { $gte: fromDate.toISOString().split("T")[0], $lte: toDate.toISOString().split("T")[0] };
    }

    // Filter by username
    if (username) {
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: "User not found" });
      filter.clientId = user._id;
    }

    const workouts = await Workout.find(filter)
      .populate("clientId", "name username email") // Include user info
      .sort({ date: -1 });

    res.json(workouts || []);
  } catch (err) {
    console.error("Error fetching workouts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update exercises for a specific workout
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { exercises } = req.body;

    if (!exercises || !Array.isArray(exercises)) {
      return res.status(400).json({ message: "Exercises must be an array" });
    }

    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { exercises },
      { new: true }
    ).populate("clientId", "name username email");

    if (!workout) return res.status(404).json({ message: "Workout not found" });

    res.json(workout);
  } catch (err) {
    console.error("Error updating workout:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
