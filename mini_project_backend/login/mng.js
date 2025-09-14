const mongoose = require("mongoose");

// Connect to your database
mongoose.connect("mongodb://localhost:27017/trainerdata")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("DB connection error:", err));

// Define a schema (flexible)
const trainerSchema = new mongoose.Schema({}, { strict: false });
const Attendance = mongoose.model("Attendance", trainerSchema);

async function showTrainers() {
  try {
    const records = await Attendance.deleteMany();   // ✅ Use Attendance not User
    console.log("All Records:", records);      // ✅ Use the same variable
  } catch (err) {
    console.error("Error fetching records:", err);
  } finally {
    mongoose.connection.close();
  }
}

showTrainers();
