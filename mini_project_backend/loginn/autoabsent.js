// autoAbsent.js
const cron = require("node-cron");
const Attendance = require("./attendence_mod");
const User = require("./client_model");

// 🕒 Every day at 11:59 PM IST
cron.schedule("59 23 * * *", async () => {
  try {
    console.log("⚙️ Auto ABSENT job running...");

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const users = await User.find({});

    for (let user of users) {
      const username = user.username;

      const attendance = await Attendance.findOne({
        username,
        date: today,
      });

      if (!attendance) {
        await Attendance.create({
          username,
          date: today,
          status: "Absent",
        });

        console.log(`❌ Marked Absent: ${username}`);
      }
    }

    console.log("✅ Auto Absent Job Completed.");
  } catch (err) {
    console.error("❌ Auto-Absent Error:", err);
  }
});

module.exports = {}; // 🔥 This is enough
