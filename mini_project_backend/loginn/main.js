require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ROUTES
const authRoutes = require("./new_trainer");
const trainerRoutes = require("./login_trainer");
const clientInfoRoutes = require("./client_info");
const clientLoginRoutes = require("./client_login");
const forgotRoutes = require("./forgot");
const clientFetchRoutes = require("./Client_fetch");
const homeRoutes = require("./user_home");
const userAttendanceRoutes = require("./user_attendence");
const specificAttendanceRoutes = require("./specific_user_attend");
const paymentRoutes = require("./paymentroute");
const sendTrainerEmail = require("./send_trainer_email");
const atttend = require("./attendence");
const total = require("./total_std");
const main = require("./trainermain");
const trainer_workout = require("./trainere_workout");
const workoutRoutes = require("./workout_routes");

// MIDDLEWARE
const authmiddle = require("./authmiddle");
const checkPayment = require("./checkPayment");

// CRON JOBS
require("./today_workout_corn");
require("./autoabsent");
require("./autopaymentreminder");

const server = express();

server.use(express.json());
server.use(cors());

// DATABASE
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Database connected"))
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });

// ================= ROUTES =================

// AUTH
server.use("/", authRoutes);
server.use("/", trainerRoutes);
server.use("/", clientInfoRoutes);
server.use("/", clientLoginRoutes);
server.use("/", forgotRoutes);

// HOME
server.use("/", homeRoutes);

// ATTENDANCE
server.use("/", userAttendanceRoutes);
server.use("/", specificAttendanceRoutes);
server.use("/attendence", authmiddle, atttend);

// CLIENT DATA
server.use("/", authmiddle, clientFetchRoutes);
server.use("/user", total);

// ================= PAYMENT =================
server.use("/payment", authmiddle, paymentRoutes);

// ================= TRAINER =================
server.use("/trainer", trainer_workout);

// 🔥🔥 IMPORTANT FIX (THIS LINE WAS MISSING)
server.use("/trainer", authmiddle, workoutRoutes);

// ================= DASHBOARD =================
server.use("/dashboard", authmiddle,  main);

// ================= WORKOUT (CLIENT) =================
server.use("/workout", authmiddle, workoutRoutes);

// ================= EMAIL =================
server.use("/email", authmiddle, sendTrainerEmail);

// ================= DEFAULT =================
server.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});