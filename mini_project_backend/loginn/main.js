const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const authRoutes = require("./new_trainer");
const trainerRoutes = require("./login_trainer");
// const client_login = require('./client_login_signup')
const clientInfoRoutes = require("./client_info");
const clientLoginRoutes = require("./client_login");
const forgot = require('./forgot')
const client_fetch = require('./Client_fetch')
const authmiddle = require('./authmiddle')
const home_user = require('./user_home')
const user_attendence = require('./user_attendence')
const specfi_atte = require('./specific_user_attend')

const server = express();
server.use(express.json());
server.use(cors());


mongoose.connect("mongodb://localhost:27017/trainerdata")
  .then(() => console.log("Database connected "))
  .catch(err => console.log("Database connection error:", err));


server.use("/", authRoutes);
server.use("/", trainerRoutes);
// server.use("/",client_login);
server.use("/", clientInfoRoutes);
server.use("/", clientLoginRoutes);
server.use('/',forgot);
server.use('/',authmiddle,client_fetch);
server.use('/',home_user);
server.use('/',user_attendence);
server.use('/',specfi_atte);

server.listen(5000, () => {
  console.log("Server running on port 5000 ");
});
