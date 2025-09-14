const express = require("express");
const Trainer = require("./mod_trainer"); 
const authMiddleware = require("./authmiddle");

const router = express.Router();

// ✅ Fetch the only trainer (no need for ID)
router.get("/home_user", authMiddleware, async (req, res) => {
  try {
    const trainer = await Trainer.findOne().select("-password -__v"); 
    // 👆 Just fetch the first trainer

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.json(trainer);
  } catch (err) {
    console.error("Error fetching trainer:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
