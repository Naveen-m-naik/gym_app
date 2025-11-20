const express = require("express");
const User = require("./client_model");
const Payment = require("./payment_model");

const router = express.Router();

router.post("/client_information", async (req, res) => {
  try {
    const { name, email, phone, weight, height, gender, place, username, password } = req.body;

    // Required field validation
    if (!name || !email || !phone || !place || !username || !password) {
      return res.status(400).json({ err: "All required fields must be filled!" });
    }

    // 1️⃣ Create User
    const newUser = new User({
      name,
      email,
      phone,
      weight,
      height,
      gender,
      place,
      username,
      password,
    });

    const savedUser = await newUser.save();

    // 2️⃣ Auto-Create First Pending Payment
    const currentMonth = new Date().getMonth() + 1;   // 1–12
    const currentYear = new Date().getFullYear();

    await Payment.create({
      userId: savedUser._id,
      status: "pending",
      amount: 500,         // your gym fee
      month: currentMonth,
      year: currentYear,
    });

    res.json({
      message: "User created successfully! First month's payment marked as pending.",
      userId: savedUser._id,
    });

  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({ err: "Email or Username already exists!" });
    }

    res.status(500).json({ err: "Server error. Try again later." });
  }
});

module.exports = router;
