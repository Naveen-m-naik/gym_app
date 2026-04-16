require("dotenv").config();
const express = require("express");
const router = express.Router();
const Payment = require("./payment_model");
const authmiddle = require("./authmiddle");

// ✅ FAKE PAYMENT (no Razorpay needed)
router.post("/pay", authmiddle, async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    // ❌ Prevent double payment
    const existing = await Payment.findOne({
      userId,
      month,
      year,
      status: "paid",
    });

    if (existing) {
      return res.status(400).json({ msg: "Already paid this month" });
    }

    const payment = await Payment.findOneAndUpdate(
      { userId, month, year },
      {
        userId,
        amount,
        month,
        year,
        status: "paid",
        paymentId: "fake_" + Date.now(),
      },
      { upsert: true, new: true }
    );

    res.json({ msg: "Payment successful", payment });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ USER: My payments
router.get("/my", authmiddle, async (req, res) => {
  const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(payments);
});

// ✅ TRAINER: All payments
router.get("/all", authmiddle, async (req, res) => {
  const payments = await Payment.find().populate("userId", "username email");
  res.json(payments);
});

// ✅ TRAINER: Stats
router.get("/stats", authmiddle, async (req, res) => {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const total = await Payment.countDocuments({ month, year });
  const paid = await Payment.countDocuments({ month, year, status: "paid" });

  res.json({
    totalUsers: total,
    paidUsers: paid,
    pendingUsers: total - paid,
  });
});

module.exports = router;