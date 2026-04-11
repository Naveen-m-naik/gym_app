const express = require("express");
const router = express.Router();

const Workout = require("./workout");
const User = require("./client_model");
const authMiddleware = require("./authmiddle");

/* ===============================
   CLIENT: TODAY WORKOUT
================================ */
router.get("/workout/today", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const workout = await Workout.findOne({
      clientId: userId,
      date: today,
    });

    return res.json(workout || { exercises: [] });
  } catch (err) {
    console.error("Client workout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   TRAINER: WORKOUT DASHBOARD
   - default → today only
   - username filter → history
   - date range filter → from/to
================================ */
router.get("/trainer/workouts", authMiddleware, async (req, res) => {
  try {
    const { username, from, to } = req.query;

    let filter = {};

    const isDefault = !username && !from && !to;

    // ✅ 1. DEFAULT → TODAY ONLY
    if (isDefault) {
      const today = new Date().toISOString().split("T")[0];
      filter.date = today;
    }

    // ✅ 2. USER FILTER
    if (username) {
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      filter.clientId = user._id;
    }

    // ✅ 3. FETCH WORKOUTS
    let workouts = await Workout.find(filter).sort({ date: -1 });

    // attach user info
    const data = await Promise.all(
      workouts.map(async (w) => {
        const user = await User.findById(w.clientId).select(
          "name username email"
        );

        return {
          ...w._doc,
          clientId: user,
        };
      })
    );

    // ✅ 4. DATE RANGE FILTER
    if (from && to) {
      const fromDate = new Date(from).getTime();
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);

      const filtered = data.filter((w) => {
        const workoutDate = new Date(w.date).getTime();
        return workoutDate >= fromDate && workoutDate <= toDate;
      });

      return res.json(filtered);
    }

    return res.json(data);
  } catch (err) {
    console.error("Trainer workout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;