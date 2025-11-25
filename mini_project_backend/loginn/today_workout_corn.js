const cron = require("node-cron");
const mongoose = require("mongoose");
require("dotenv").config();

const Workout = require("./workout");
const User = require("./client_model");

// -------------------------
//   Exercise Pool
// -------------------------
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

// --------------------------------------------
// Pick random exercise avoiding last 7 days
// --------------------------------------------
function pickExercise(pool, excluded) {
  const filtered = pool.filter((ex) => !excluded.includes(ex.name));
  if (filtered.length === 0) return null; // nothing left
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// --------------------------------------------
// Connect to MongoDB ONCE for cron
// --------------------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Cron DB connected"))
  .catch((err) => console.error("❌ Cron DB error:", err));

// --------------------------------------------
// Run cron daily at 6:00 AM
// --------------------------------------------
cron.schedule("0 6 * * *", async () => {
  console.log("🔄 Running 6 AM cron: Generating workouts...");

  try {
    const users = await User.find({}).sort({ _id: 1 });
    const today = new Date().toISOString().split("T")[0];

    for (const [index, user] of users.entries()) {
      // Skip if workout already exists
      const existing = await Workout.findOne({ clientId: user._id, date: today });
      if (existing) continue;

      // Rotate muscles based on user index + date
      const day = new Date().getDate();
      const muscleIndex = (index + day) % muscles.length;
      const muscleOfDay = muscles[muscleIndex];

      // Fetch last 7 days data
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      const lastWeekWorkouts = await Workout.find({
        clientId: user._id,
        date: { $gte: lastWeek.toISOString().split("T")[0] },
      });

      const usedExercises = lastWeekWorkouts.flatMap((w) =>
        w.exercises.map((e) => e.name)
      );

      // Generate 5 exercises
      const exercises = [];
      const pool = exercisesPool[muscleOfDay];

      while (exercises.length < 5) {
        const ex = pickExercise(pool, usedExercises);
        if (!ex) break;
        exercises.push(ex);
        usedExercises.push(ex.name);
      }

      // Save workout
      await new Workout({
        clientId: user._id,
        date: today,
        exercises,
      }).save();
    }

    console.log("✅ All workouts generated successfully at 6 AM!");
  } catch (err) {
    console.error("❌ Error generating workouts:", err);
  }
});
