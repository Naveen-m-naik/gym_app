const cron = require("node-cron");
const Payment = require("./payment_model");
const User = require("./client_model");
const sendEmail = require("./payment_mail");

// Run every 1st of month
cron.schedule("0 9 1 * *", async () => {
  console.log("Running monthly payment system...");

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const users = await User.find({ role: "client" });

  for (const user of users) {
    const existing = await Payment.findOne({
      userId: user._id,
      month,
      year,
    });

    if (!existing) {
      await Payment.create({
        userId: user._id,
        amount: 500,
        month,
        year,
        status: "pending",
      });
    }

    if (user.email) {
      await sendEmail(
        user.email,
        "Gym Payment Reminder",
        `Hi ${user.username}, please pay your monthly fee.`
      );
    }
  }
});