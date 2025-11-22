const express = require("express");
const Workout = require("./workout");
const User = require("./client_model");
const authMiddleware = require("./authmiddle");

const router = express.Router();

/*
  GET /trainer/workouts
  Behavior:
  ✔ If no filters → return ONLY today's workouts
  ✔ If username/date filters passed → return filtered workouts
*/
router.get("/workouts", authMiddleware, async (req, res) => {
  const { username, from, to } = req.query;

  try {
    let filter = {};

    const noFilterUsed = !username && !from && !to; // NOTHING entered by user

    // 1️⃣ Load ONLY TODAY'S WORKOUTS on first page load
    if (noFilterUsed) {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      filter.date = today;
    }

    // 2️⃣ If username filter applied → find user
    if (username) {
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: "User not found" });

      filter.clientId = user._id; // match workouts
    }

    // 3️⃣ Fetch workouts (NO POPULATE)
    const workouts = await Workout.find(filter).sort({ date: -1 });

    // 4️⃣ Attach user info manually (because populate fails)
    const mapped = await Promise.all(
      workouts.map(async (w) => {
        const user = await User.findById(w.clientId).select("name username email");
        return {
          ...w._doc,
          clientId: user || null,
        };
      })
    );

    // 5️⃣ Manual date range filter
    let final = mapped;

    if (from && to) {
      const fromTime = new Date(from).getTime();
      const toTime = new Date(to).setHours(23, 59, 59, 999);

      final = mapped.filter((w) => {
        const workoutTime = new Date(w.date).getTime();
        return workoutTime >= fromTime && workoutTime <= toTime;
      });
    }

    return res.json(final);
  } catch (err) {
    console.error("Error fetching workouts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/*
  PUT /trainer/workouts/:id
  Update exercises
*/
router.put("/workouts/:id", authMiddleware, async (req, res) => {
  try {
    const { exercises } = req.body;

    if (!exercises || !Array.isArray(exercises)) {
      return res.status(400).json({ message: "Exercises must be an array" });
    }

    const updated = await Workout.findByIdAndUpdate(
      req.params.id,
      { exercises },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // attach user details
    const user = await User.findById(updated.clientId).select("name username email");

    res.json({
      ...updated._doc,
      clientId: user || null,
    });
  } catch (err) {
    console.error("Error updating workout:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
