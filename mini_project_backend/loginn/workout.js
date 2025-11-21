const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  exercises: [
    {
      name: String,
      reps: Number,
      sets: Number,
      duration: Number, // seconds
    },
  ],
});

module.exports = mongoose.model("Workout", workoutSchema);
