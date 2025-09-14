import React, { useState } from "react";
import "../style/gymform.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GymForm() {
  const correctcode = "123"; // code should be a string
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

    // ✅ check secret code
    if (secret !== correctcode) {
      toast.error("❌ Invalid Code!", { autoClose: 3000 });
      return;
    }

    // ✅ check phone number length
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("📞 Phone number must be 10 digits!", { autoClose: 3000 });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/trainerdata", formData);
      toast.success(res.data.message || "✅ Account is created", {
        autoClose: 3000,
      });

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
      toast.error(err.response?.data?.error || "❌ Account is not created", {
        autoClose: 3000,
      });
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
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
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
      />

      <input
        type="text"
        name="timings"
        placeholder="Timings (e.g. 6 AM - 10 PM)"
        value={formData.timings}
        onChange={handleChange}
      />

      {/* Secret Code */}
      <input
        type="text"
        placeholder="Enter the code"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
      />

      <h3>Login Credentials</h3>
      <input
        type="text"
        name="username"
        placeholder="Choose a username (for login)"
        value={formData.username}
        onChange={handleChange}
        autoComplete="new-username"
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
      />
      <small style={{ color: "gray" }}>
        You’ll use this password when logging in.
      </small>

      <button type="submit">Register</button>

      {/* Toast Container */}
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
