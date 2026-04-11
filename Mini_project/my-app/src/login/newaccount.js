import React, { useState } from "react";
import "../style/gymform.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GymForm() {
  const correctcode = "123";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Trainername: "",
    email: "",
    phone: "",
    gymName: "",
    timings: "",
    username: "",
    password: "",
  });

  const [secret, setSecret] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    // ✅ Secret Code
    if (secret !== correctcode) {
      toast.error("❌ Invalid Code!");
      return;
    }

    // ✅ Trainer Name
    if (!formData.Trainername.trim()) {
      toast.error("👤 Trainer name is required!");
      return;
    }

    // ✅ Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("📧 Enter valid email!");
      return;
    }

    // ✅ Phone
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("📞 Phone number must be 10 digits!");
      return;
    }

    // ✅ Gym Name
    if (!formData.gymName.trim()) {
      toast.error("🏋️ Gym name is required!");
      return;
    }

    // ✅ Timings
    if (!formData.timings.trim()) {
      toast.error("⏰ Timings are required!");
      return;
    }

    // ✅ Username
    if (formData.username.length < 4) {
      toast.error("👤 Username must be at least 4 characters!");
      return;
    }

    // ✅ Password (strong)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("🔒 Password must contain letters & numbers (min 6 chars)!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/trainerdata",
        formData
      );

      toast.success(res.data.message || "✅ Account created!");

      setFormData({
        Trainername: "",
        email: "",
        phone: "",
        gymName: "",
        timings: "",
        username: "",
        password: "",
      });
      setSecret("");

      navigate("/login/trainerlogin");

    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Account not created");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="gym-form">
      <h2>Gym / Trainer Registration</h2>

      <h3>Trainer & Gym Details</h3>

      <input
        type="text"
        name="Trainername"
        placeholder="Your Name"
        value={formData.Trainername}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        pattern="[0-9]{10}"
        maxLength="10"
        required
      />

      <input
        type="text"
        name="gymName"
        placeholder="Gym Name"
        value={formData.gymName}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="timings"
        placeholder="Timings (e.g. 6 AM - 10 PM)"
        value={formData.timings}
        onChange={handleChange}
        required
      />

      {/* Secret Code */}
      <input
        type="text"
        placeholder="Enter the code"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        required
      />

      <h3>Login Credentials</h3>

      <input
        type="text"
        name="username"
        placeholder="Choose a username"
        value={formData.username}
        onChange={handleChange}
        autoComplete="new-username"
        required
      />
      <small style={{ color: "gray" }}>
        This will be your login username.
      </small>

      <input
        type="password"
        name="password"
        placeholder="Create a strong password"
        value={formData.password}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />
      <small style={{ color: "gray" }}>
        Password must contain letters & numbers.
      </small>

      <button type="submit">Register</button>

      <ToastContainer
        position="bottom-center"
        theme="colored"
        autoClose={3000}
        closeButton={false}
      />
    </form>
  );
}

export default GymForm;