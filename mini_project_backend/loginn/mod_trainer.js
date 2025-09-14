const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const trainerSchema = new mongoose.Schema({
  Trainername: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gymName: { type: String, required: true },
  timings: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 🔹 Extra fields for password reset
  resetCode: { type: String, select: false }, 
  resetCodeExpire: { type: Date, select: false }
});

// Hash password before saving
trainerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hide sensitive fields when converting to JSON
trainerSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetCode;
  delete obj.resetCodeExpire;
  return obj;
};

module.exports = mongoose.model("Trainer", trainerSchema);
