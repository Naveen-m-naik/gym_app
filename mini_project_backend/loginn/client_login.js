const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./client_model");

const router = express.Router();

// POST /client_login
router.post("/client_login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const existUser = await User.findOne({ username });
    if (!existUser) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    // Check if password is valid
    const validPassword = await bcrypt.compare(password, existUser.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: existUser._id, username: existUser.username }, // payload
      "mySecretKey",                                       // secret (use .env in production)
      { expiresIn: "1h" }                                  // token valid for 1 hour
    );

    // ✅ Successful login response
    res.json({
      success: true,
      token: token,
      message: "Login successful"
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

module.exports = router;
