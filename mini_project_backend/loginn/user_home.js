const express = require("express");
const Trainer = require("./mod_trainer");
const User = require("./client_model");
const authMiddleware = require("./authmiddle");

const router = express.Router();

// ✅ Fetch Trainer + Logged-in Client
router.get("/home_user", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // 🔥 from JWT

    // 🔹 Trainer (first one)
    const trainer = await Trainer.findOne().select("-password -__v");

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // 🔹 Client (logged-in user)
    const client = await User.findById(userId);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // ✅ Send both
    res.json({
      trainer,
      client,
    });

  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;