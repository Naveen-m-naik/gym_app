const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  currency: {
    type: String,
    default: "INR",
  },

  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },

  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,

  // 🔥 NEW → Prevent double payment
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  }

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
