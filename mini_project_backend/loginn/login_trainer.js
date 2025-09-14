const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Trainer = require("./mod_trainer");

const router = express.Router();

// Trainer Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if trainer exists
    const trainer = await Trainer.findOne({ username });
    if (!trainer) {
      return res.json({ success: false, message: "Username not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, trainer.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: trainer._id, username: trainer.username, role: "trainer" },
      "mySecretKey", // ⚠️ Use process.env.JWT_SECRET in production
      { expiresIn: "1h" }
    );

    res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
