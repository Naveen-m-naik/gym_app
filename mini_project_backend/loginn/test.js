require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../client_model");
const Workout = require("../workout_model");
const exercises = require("../utils/workout_by_group"); // adjust path

async function createTestWorkout() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ DB connected");

    const user = await User.findOne();
    if (!user) {
      console.log("No users found in DB");
      return;
    }

    const workoutData = exercises(user._id);
    await Workout.create(workoutData);

    console.log("✅ Test workout created!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createTestWorkout();
