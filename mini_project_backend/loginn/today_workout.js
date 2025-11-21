const express = require("express");
const router = express.Router();
const Workout = require("./workout");
const User = require("./client_model"); // Your user model
const authmiddle = require("./authmiddle");

// Exercises grouped by muscle
const exercisesPool = {
  Biceps: [
    { name: "Bicep Curls", reps: 12, sets: 3 },
    { name: "Hammer Curls", reps: 12, sets: 3 },
    { name: "Concentration Curls", reps: 12, sets: 3 },
    { name: "Cable Curls", reps: 12, sets: 3 },
    { name: "Incline Dumbbell Curls", reps: 12, sets: 3 },
    { name: "EZ Bar Curls", reps: 12, sets: 3 },
  ],
  Triceps: [
    { name: "Tricep Dips", reps: 12, sets: 3 },
    { name: "Skull Crushers", reps: 12, sets: 3 },
    { name: "Tricep Kickbacks", reps: 12, sets: 3 },
    { name: "Overhead Tricep Extension", reps: 12, sets: 3 },
    { name: "Close-Grip Push-ups", reps: 15, sets: 3 },
    { name: "Rope Pushdowns", reps: 12, sets: 3 },
  ],
  Chest: [
    { name: "Push-ups", reps: 15, sets: 3 },
    { name: "Bench Press", reps: 12, sets: 3 },
    { name: "Incline Dumbbell Press", reps: 12, sets: 3 },
    { name: "Chest Fly", reps: 12, sets: 3 },
    { name: "Cable Crossover", reps: 12, sets: 3 },
    { name: "Decline Press", reps: 12, sets: 3 },
  ],
  Back: [
    { name: "Pull-ups", reps: 10, sets: 3 },
    { name: "Bent Over Rows", reps: 12, sets: 3 },
    { name: "Lat Pulldown", reps: 12, sets: 3 },
    { name: "Deadlift", reps: 10, sets: 3 },
    { name: "Seated Row", reps: 12, sets: 3 },
    { name: "T-Bar Row", reps: 12, sets: 3 },
  ],
  Legs: [
    { name: "Squats", reps: 20, sets: 3 },
    { name: "Lunges", reps: 12, sets: 3 },
    { name: "Leg Press", reps: 15, sets: 3 },
    { name: "Calf Raises", reps: 20, sets: 3 },
    { name: "Leg Curl", reps: 12, sets: 3 },
    { name: "Bulgarian Split Squat", reps: 12, sets: 3 },
  ],
};

const muscles = ["Biceps", "Triceps", "Chest", "Back", "Legs"];

// Pick one random exercise from pool avoiding last week
function pickExercise(pool, excluded) {
  const filtered = pool.filter((ex) => !excluded.includes(ex.name));
  if (filtered.length === 0) return null;
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return shuffled[0];
}

// Route: GET /workout/today
router.get("/today", authmiddle, async (req, res) => {
  try {
    const clientId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    // 1️⃣ Check if workout already exists
    let workout = await Workout.findOne({ clientId, date: today });
    if (workout) return res.json(workout);

    // 2️⃣ Get all users to assign muscles differently
    const users = await User.find({}, "_id").sort({ _id: 1 }); // sorted list
    const userIndex = users.findIndex((u) => u._id.toString() === clientId);
    const todayOffset = new Date().getDate(); // rotate daily

    // Assign muscle based on user index + day offset
    const muscleIndex = (userIndex + todayOffset) % muscles.length;
    const muscleOfTheDay = muscles[muscleIndex];

    // 3️⃣ Get last 7 days exercises for this user
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekWorkouts = await Workout.find({
      clientId,
      date: { $gte: lastWeek.toISOString().split("T")[0] },
    });

    const usedExercises = [];
    lastWeekWorkouts.forEach((w) => w.exercises.forEach((ex) => usedExercises.push(ex.name)));

    // 4️⃣ Pick 5 exercises for the assigned muscle avoiding repeats
    const exercises = [];
    const pool = exercisesPool[muscleOfTheDay];
    while (exercises.length < 5) {
      const ex = pickExercise(pool, usedExercises);
      if (!ex) break; // all exercises used last week
      exercises.push(ex);
      usedExercises.push(ex.name);
    }

    // 5️⃣ Save workout
    workout = new Workout({ clientId, date: today, exercises });
    await workout.save();

    res.json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
