const cron = require("node-cron");
const mongoose = require("mongoose");
const Workout = require("./workout");
const User = require("./client_model");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

// Exercise Pool
const exercisesPool = {
  Biceps: [
    { name: "Bicep Curls", reps: 12, sets: 3 },
    { name: "Hammer Curls", reps: 12, sets: 3 },
  ],
  Chest: [
    { name: "Push Ups", reps: 15, sets: 3 },
    { name: "Bench Press", reps: 12, sets: 3 },
  ],
  Back: [
    { name: "Pull Ups", reps: 10, sets: 3 },
    { name: "Lat Pulldown", reps: 12, sets: 3 },
  ],
  Legs: [
    { name: "Squats", reps: 20, sets: 3 },
    { name: "Lunges", reps: 12, sets: 3 },
  ],
  Triceps: [
    { name: "Tricep Dips", reps: 12, sets: 3 },
    { name: "Skull Crushers", reps: 12, sets: 3 },
  ],
};

const muscles = Object.keys(exercisesPool);

// 🕙 10:05 PM DAILY CRON
cron.schedule("9 11 * * *", async () => {
  console.log("\n🔥 ===== 10:05 PM WORKOUT GENERATION STARTED =====\n");

  try {
    const users = await User.find();
    const today = new Date().toISOString().split("T")[0];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      const exists = await Workout.findOne({
        clientId: user._id,
        date: today,
      });

      if (exists) {
        console.log(`⏭️ Skipped (already exists): ${user.name}`);
        continue;
      }

      const muscle = muscles[i % muscles.length];
      const pool = exercisesPool[muscle];

      const selected = pool
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const newWorkout = await Workout.create({
        clientId: user._id,
        date: today,
        exercises: selected,
      });

      // ✅ PRINT IN TERMINAL
      console.log("\n------------------------------");
      console.log(`👤 User: ${user.name} (@${user.username})`);
      console.log(`💪 Muscle: ${muscle}`);
      console.log("🏋️ Workout:");

      selected.forEach((ex, index) => {
        console.log(
          `${index + 1}. ${ex.name} - ${ex.reps || ex.duration} x ${ex.sets}`
        );
      });

      console.log("------------------------------\n");
    }

    console.log("✅ ALL WORKOUTS GENERATED SUCCESSFULLY AT 10:05 PM\n");
  } catch (err) {
    console.log("❌ Cron error:", err);
  }
});