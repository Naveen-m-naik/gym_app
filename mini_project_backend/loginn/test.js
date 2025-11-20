require("dotenv").config();
const axios = require("axios");

// -----------------------------
// 🔹 Replace these with your own values
// -----------------------------
const token = "YOUR_NEW_VALID_JWT_TOKEN"; // Get this from login
const userId = "USER_ID_FROM_DB";         // Replace with a real user ID
const userEmail = "useremail@example.com"; // Email to receive payment confirmation
const amount = 500;                         // Gym monthly fee
// -----------------------------

async function testPayment() {
  try {
    console.log("Creating order...");

    // 1️⃣ Create order
    const orderRes = await axios.post(
      "http://localhost:5000/payment/create-order",
      { userId, amount },
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    const order = orderRes.data;
    console.log("Order created successfully:", order);

    // -----------------------------
    // 2️⃣ Simulate Razorpay payment response (normally this comes from frontend)
    // -----------------------------
    const razorpayOrderId = order.id;
    const razorpayPaymentId = "pay_test_1234567890"; // Fake Razorpay payment ID
    const crypto = require("crypto");

    const sign = razorpayOrderId + "|" + razorpayPaymentId;
    const razorpaySignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    console.log("Verifying payment...");

    // 3️⃣ Verify payment
    const verifyRes = await axios.post(
      "http://localhost:5000/payment/verify-payment",
      {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        userEmail,
        amount,
      },
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    console.log("Payment verification response:", verifyRes.data);

  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

// Run the test
testPayment();
