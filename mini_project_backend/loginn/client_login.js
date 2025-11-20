const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./client_model"); // your Mongoose user model
require("dotenv").config();

const router = express.Router();

router.post("/client_login", async (req, res) => {
  try {
    const { username, password } = req.body || {}; // prevent destructure error

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username & password required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "mySecretKey",
      { expiresIn: "1h" }
    );

    res.json({ success: true, token, user });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
