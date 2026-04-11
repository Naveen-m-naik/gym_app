const express = require("express");
const User = require("./client_model");
const authMiddleware = require("./authmiddle");

const router = express.Router();

/* ================= GET ALL USERS ================= */
router.get("/view", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= SEARCH USER ================= */
router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;

    const users = await User.find({
      name: { $regex: name, $options: "i" },
    }).sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= DELETE USER ================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= UPDATE USER ================= */
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        weight: req.body.weight,
        height: req.body.height,
        gender: req.body.gender,
        place: req.body.place,
        username: req.body.username,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updated,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;