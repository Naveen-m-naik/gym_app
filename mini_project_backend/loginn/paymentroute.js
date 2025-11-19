require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const Payment = require("./payment_model");
const crypto = require("crypto");
const transporter = require("./mailer"); // ✅ Shared transporter
const authmiddle = require("./authmiddle"); // ✅ Import auth middleware

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ✅ Create payment order (authenticated)
router.post("/create-order", authmiddle, async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const options = {
      amount: amount * 100, // convert to paisa
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      userId,
      amount,
      razorpayOrderId: order.id,
      status: "pending",
    });

    await payment.save();

    res.send(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).send({ error: "Error creating order" });
  }
});

// ✅ Verify payment (authenticated)
router.post("/verify-payment", authmiddle, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userEmail } = req.body;

    const sign = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign === razorpaySignature) {
      // Update payment status
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        {
          status: "paid",
          razorpayPaymentId,
          razorpaySignature,
        }
      );

      // ✅ Send email notification
      if (userEmail) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Payment Successful",
            text: `Your payment of ₹${req.body.amount || 0} has been received successfully. Thank you!`,
          });
          console.log("Payment confirmation email sent to", userEmail);
        } catch (emailErr) {
          console.error("Error sending payment email:", emailErr);
        }
      }

      return res.send({ success: true });
    }

    res.status(400).send({ success: false, message: "Invalid signature" });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).send({ error: "Error verifying payment" });
  }
});

module.exports = router;
