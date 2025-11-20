const express = require("express");
const router = express.Router();
const User = require("./client_model"); // your existing User model
const Attendance = require("./attendence_mod"); // your Attendance model
const Payment = require("./payment_model"); // Payment model

// GET /dashboard/stats → return total students, today's attendance, pending payments
router.get("/stats", async (req, res) => {
  try {
    // 1️⃣ Total students
    const totalStudents = await User.countDocuments();

    // 2️⃣ Today's attendance (timezone-safe)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`; // e.g., "2025-11-20"

    const todayAttendance = await Attendance.countDocuments({
      date: todayStr,
      status: "Present",
    });

    // 3️⃣ Pending payments
    const pendingPayments = await Payment.countDocuments({ status: "pending" });

    // Return JSON
    res.json({
      totalStudents,
      todayAttendance,
      pendingPayments,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
