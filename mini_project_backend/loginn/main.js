require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./new_trainer");
const trainerRoutes = require("./login_trainer");
const clientInfoRoutes = require("./client_info");
const clientLoginRoutes = require("./client_login");
const forgotRoutes = require("./forgot");
const clientFetchRoutes = require("./Client_fetch");
const authmiddle = require("./authmiddle");
const homeRoutes = require("./user_home");
const userAttendanceRoutes = require("./user_attendence");
const specificAttendanceRoutes = require("./specific_user_attend");
const paymentRoutes = require("./paymentroute");
const sendTrainerEmail = require("./send_trainer_email");
const atttend = require("./attendence")
const total = require('./total_std')
const main = require('./trainermain')
const workoutRoutes = require("./today_workout");
const trainer_workout = require('./trainere_workout')

// require("./daily_systematic_workout"); // Cron job to auto-assign daily workouts
require("./autoabsent");
require("./autopaymentreminder");

const server = express();

server.use(express.json());
server.use(cors());

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

server.use("/", authRoutes);
server.use("/", trainerRoutes);
server.use("/", clientInfoRoutes);
server.use("/", clientLoginRoutes);
server.use("/", forgotRoutes);
server.use("/", homeRoutes);
server.use("/", userAttendanceRoutes);
server.use("/", specificAttendanceRoutes);
server.use('/user',total);
server.use('/dashboard',main);
server.use("/workout", workoutRoutes);

server.use("/trainer", trainer_workout);
// server.use("/workout", authmiddle, workoutRoutes);
server.use('/attendence',authmiddle,atttend);
server.use("/", authmiddle, clientFetchRoutes);
server.use("/payment", authmiddle, paymentRoutes);
server.use("/email", authmiddle, sendTrainerEmail);

server.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
