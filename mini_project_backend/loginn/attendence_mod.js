const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    date: { type: String, required: true }, // store as string "YYYY-MM-DD"
    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
