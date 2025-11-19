// autopaymentreminder.js
const cron = require("node-cron");
const Payment = require("./payment_model");
const User = require("./client_model");
const sendEmail = require("./sendEmail"); // ✅ Reusable email function

// Run every day at 10:00 AM
cron.schedule("0 10 * * *", async () => {
  console.log("Checking pending payments...");

  try {
    // Get all pending payments with user details
    const pendingPayments = await Payment.find({ status: "pending" }).populate("userId");

    for (const payment of pendingPayments) {
      const user = payment.userId;
      if (!user || !user.email) continue; // skip if no valid email

      const subject = "Gym Monthly Payment Pending";
      const text = `Dear ${user.username},\n\nYour monthly gym payment is still pending. Please pay as soon as possible.\n\nThank you!`;

      try {
        await sendEmail(user.email, subject, text);
        console.log("Reminder sent to", user.email);
      } catch (err) {
        console.error("Error sending payment reminder to", user.email, err);
      }
    }

    console.log("All pending payment emails processed.");
  } catch (err) {
    console.error("Error fetching pending payments:", err);
  }
});
