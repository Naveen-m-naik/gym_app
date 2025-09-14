const express = require("express");
const Trainer = require("./mod_trainer");

const router = express.Router();


router.post("/trainerdata", async (req, res) => {
  try {
    const { Trainername, email, phone, gymName, timings, fees, username, password } = req.body;

    
    if (await Trainer.findOne({ phone })) {
      return res.json({ message: "Phone already exists" });
    }
    if (await Trainer.findOne({ email })) {
      return res.json({ message: "Email already exists" });
    }
    if (await Trainer.findOne({ username })) {
      return res.json({ message: "Username already exists" });
    }

    
    const newTrainer = new Trainer({ Trainername, email, phone, gymName, timings, fees, username, password });
    await newTrainer.save();

    res.json({ message: "Trainer account created " });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;