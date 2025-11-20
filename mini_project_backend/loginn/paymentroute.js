require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const Payment = require("./payment_model");
const crypto = require("crypto");
const transporter = require("./mailer");
const authmiddle = require("./authmiddle");

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// CREATE ORDER (PREVENT DOUBLE PAYMENT)
router.post("/create-order", authmiddle, async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid userId or amount" });
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const existingPayment = await Payment.findOne({
      userId,
      month: currentMonth,
      year: currentYear,
      status: "paid",
    });

    if (existingPayment) {
      return res.status(400).json({ error: "Payment already completed for this month" });
    }

    const options = { amount: amount * 100, currency: "INR", receipt: "receipt_" + Date.now() };
    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      userId,
      amount,
      razorpayOrderId: order.id,
      status: "pending",
      month: currentMonth,
      year: currentYear,
    });

    await payment.save();
    res.json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Server error while creating order" });
  }
});

// VERIFY PAYMENT
router.post("/verify-payment", authmiddle, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userEmail, amount } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ error: "Missing required Razorpay fields" });
    }

    const sign = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign).digest("hex");

    if (expectedSign !== razorpaySignature) {
      return res.status(400).json({ success: false, message: "Invalid Razorpay signature" });
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      { status: "paid", razorpayPaymentId, razorpaySignature },
      { new: true }
    );

    if (!payment) return res.status(404).json({ error: "Payment record not found" });

    if (userEmail) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: "Payment Successful",
          text: `Your payment of ₹${amount} has been received successfully.`,
        });
      } catch (emailErr) {
        console.error("Error sending payment email:", emailErr);
      }
    }

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ error: "Server error while verifying payment" });
  }
});

module.exports = router;
