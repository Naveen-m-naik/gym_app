const express = require("express");
const router = express.Router();

const User = require("./client_model");
const Attendance = require("./attendence_mod");
const Payment = require("./payment_model");

/* ================= DASHBOARD STATS ================= */
router.get("/stats", async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

    // ✅ TOTAL STUDENTS (YOU DON'T HAVE ROLE FIELD)
    const totalStudents = await User.countDocuments();

    // ✅ TODAY ATTENDANCE
    const todayAttendance = await Attendance.countDocuments({
      date: today,
      status: "Present",
    });

    // ✅ UNIQUE USERS WITH PENDING PAYMENT
    const pendingUsers = await Payment.find({
      status: "pending",
    }).distinct("userId");

    const pendingPayments = pendingUsers.length;

    console.log("📊 FINAL STATS:", {
      totalStudents,
      todayAttendance,
      pendingPayments,
      today,
    });

    res.json({
      totalStudents,
      todayAttendance,
      pendingPayments,
    });
  } catch (err) {
    console.error("❌ Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;