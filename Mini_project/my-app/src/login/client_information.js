import React, { useState } from "react";
import "../style/client_information.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    weight: "",
    height: "",
    gender: "",
    place: "",
    username: "",
    password: "",
    registeredAt: new Date().toISOString(), // ✅ store registration date & time
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/client_information",
        {
          ...formData,
          registeredAt: new Date().toISOString(), // ✅ send fresh timestamp on submit
        }
      );

      toast.success(res.data.message || "✅ Signup successful", {
        autoClose: 3000,
      });

      // reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        weight: "",
        height: "",
        gender: "",
        place: "",
        username: "",
        password: "",
        registeredAt: new Date().toISOString(),
      });

      navigate("/login/client");
    } catch (err) {
      toast.error(err.response?.data?.err || "❌ Signup failed", {
        autoClose: 3000,
      });
    }
  }

  return (
    <div className="landing-wrapper">
      <div className="overlay"></div>

      <div className="landing-content">
        <form onSubmit={handleSubmit} className="user-form">
          <h2>Client Signup</h2>

          <h3>Personal Details</h3>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
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
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={formData.weight}
            onChange={handleChange}
          />

          <input
            type="number"
            name="height"
            placeholder="Height (cm)"
            value={formData.height}
            onChange={handleChange}
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            name="place"
            placeholder="Place"
            value={formData.place}
            onChange={handleChange}
            required
          />

          <h3>Login Credentials</h3>
          <input
            type="text"
            name="username"
            placeholder="Choose a username (for login)"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="new-username"
          />
          <small>This will be your login username.</small>

          <input
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          <small>You’ll use this password when logging in.</small>

          {/* ✅ Show registration date & time */}
          <div className="registration-time">
            <label>Registration Date & Time:</label>
            <p>{new Date(formData.registeredAt).toLocaleString()}</p>
          </div>

          <button type="submit">Signup</button>

          <ToastContainer
            position="bottom-center"
            theme="colored"
            autoClose={3000}
            closeButton={false}
          />
        </form>
      </div>
    </div>
  );
}

export default UserForm;
