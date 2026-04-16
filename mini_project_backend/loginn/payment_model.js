const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: Number,

  month: Number,
  year: Number,

  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },

  paymentId: String,
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);