const express = require("express");
const User = require("./client_model");  // your client schema
// const authMiddleware = require("./authmiddle"); // ✅ middleware

const router = express.Router();

// ✅ Protected route: fetch all clients
router.get("/clients",  async (req, res) => {
  try {
    const clients = await User.find({}, "-password -__v"); 
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Server error. Try again later." });
  }
});

module.exports = router;
