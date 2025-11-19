require("dotenv").config({ path: __dirname + "/../.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const authRoutes = require("./new_trainer");
const trainerRoutes = require("./login_trainer");
const clientInfoRoutes = require("./client_info");
const clientLoginRoutes = require("./client_login");
const forgotRoutes = require("./forgot");
const clientFetchRoutes = require("./Client_fetch");
const authmiddle = require('./authmiddle');
const homeRoutes = require("./user_home");
const userAttendanceRoutes = require("./user_attendence");
const specificAttendanceRoutes = require("./specific_user_attend");
const paymentRoutes = require("./paymentroute");
const sendTrainerEmail = require("./send_trainer_email");

// Cron jobs
require("./autoabsent");
require("./autopaymentreminder");

const server = express();

// Middleware
server.use(express.json());
server.use(cors());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch(err => console.log("Database connection error:", err));

// Mount routes
server.use("/", authRoutes);
server.use("/", trainerRoutes);
server.use("/", clientInfoRoutes);
server.use("/", clientLoginRoutes);
server.use("/", forgotRoutes);
server.use("/", authmiddle, clientFetchRoutes);
server.use("/", homeRoutes);
server.use("/", userAttendanceRoutes);
server.use("/", specificAttendanceRoutes);
server.use("/", paymentRoutes);

// Email route (requires auth)
server.use("/email", authmiddle, sendTrainerEmail);

// Root
server.get("/", (req, res) => res.send("Backend is running!"));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
