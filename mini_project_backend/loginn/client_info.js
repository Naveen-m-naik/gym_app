const express = require("express");
const User = require("./client_model");   // same folder ✅

const router = express.Router();

router.post("/client_information", async (req, res) => {
  // console.log("Received Data:", req.body);

  try {
    const { name, email, phone, weight, height, gender, place, username, password } = req.body;

    if (!name || !email || !phone || !place || !username || !password) {
      return res.status(400).json({ err: "All required fields must be filled!" });
    }

    const newUser = new User({ name, email, phone, weight, height, gender, place, username, password });
    await newUser.save();

    res.json({ message: "User information submitted successfully!" });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      res.status(400).json({ err: "Email or Username already exists!" });
    } else {
      res.status(500).json({ err: "Server error. Try again later." });
    }
  }
});

module.exports = router;
