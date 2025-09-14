const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    weight: { type: Number },
    height: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    place: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 🔹 Extra fields for password reset
    resetCode: { type: String, select: false },
    resetCodeExpire: { type: Date, select: false },
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt automatically
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hide sensitive fields when sending response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetCode;
  delete obj.resetCodeExpire;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
