const cron = require("node-cron");
const mongoose = require("mongoose");
require("dotenv").config();

const Workout = require("./workout");
const User = require("./client_model");

// Exercises pool and muscles (use your existing setup)
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

// Pick one random exercise avoiding last week
function pickExercise(pool, excluded) {
  const filtered = pool.filter((ex) => !excluded.includes(ex.name));
  if (filtered.length === 0) return null;
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return shuffled[0];
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB connected for cron"))
  .catch((err) => console.error(err));

// Cron job: run every day at 00:01
cron.schedule("1 0 * * *", async () => {
  console.log("🔄 Generating daily workouts...");

  try {
    const users = await User.find({}).sort({ _id: 1 });
    const today = new Date().toISOString().split("T")[0];

    for (const [userIndex, user] of users.entries()) {
      const exists = await Workout.findOne({ clientId: user._id, date: today });
      if (exists) continue; // Skip if already exists

      // Muscle rotation
      const todayOffset = new Date().getDate();
      const muscleIndex = (userIndex + todayOffset) % muscles.length;
      const muscleOfTheDay = muscles[muscleIndex];

      // Last 7 days exercises
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastWeekWorkouts = await Workout.find({
        clientId: user._id,
        date: { $gte: lastWeek.toISOString().split("T")[0] },
      });

      const usedExercises = [];
      lastWeekWorkouts.forEach((w) => w.exercises.forEach((ex) => usedExercises.push(ex.name)));

      // Pick 5 exercises
      const exercises = [];
      const pool = exercisesPool[muscleOfTheDay];
      while (exercises.length < 5) {
        const ex = pickExercise(pool, usedExercises);
        if (!ex) break;
        exercises.push(ex);
        usedExercises.push(ex.name);
      }

      // Save workout
      const workout = new Workout({ clientId: user._id, date: today, exercises });
      await workout.save();
    }

    console.log("✅ Daily workouts generated for all users!");
  } catch (err) {
    console.error("❌ Error generating workouts:", err);
  }
});
