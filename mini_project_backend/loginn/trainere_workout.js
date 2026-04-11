const express = require("express");
const router = express.Router();

const Workout = require("./workout");
const User = require("./client_model");
const auth = require("./authmiddle"); // ✅ FIXED NAME

/* ================= CLIENT: TODAY WORKOUT ================= */
router.get("/workout/today", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const workout = await Workout.findOne({
      clientId: userId,
      date: today,
    });

    res.json(workout || { exercises: [] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= TRAINER: ALL WORKOUTS ================= */
// router.get("/trainer/workouts", auth, async (req, res) => {
//   try {
//     const workouts = await Workout.find()
//       .populate("clientId", "name username email")
//       .sort({ date: -1 });

//     res.json(workouts);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });




module.exports = router;