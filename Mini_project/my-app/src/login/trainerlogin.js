import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/trainer_login.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Trainer_log() {
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", trainer);

      if (res.data.success) {
        // ✅ Save token in localStorage
        localStorage.setItem("token", res.data.token);

        toast.success(res.data.message || "Login successful", {
          position: "top-right",
        });

        navigate("/Trainer_dash/trainer_main"); // navigate only on success
      } else {
        toast.error(res.data.message || "Login failed", {
          position: "top-right",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", {
        position: "top-right",
      });
    }
  }

  return (
  <div className="trainer-wrapper">
    <div className="trainer-overlay"></div>

    <form onSubmit={handleSubmit} className="trainer-box">
      <p>Trainer Login</p>

      <div className="trainer-inputs">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={trainer.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={trainer.password}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="trainer-btn">Login</button>

      <div className="trainer-links">
        <Link to="/login/forgot">Forgot Password?</Link>
      </div>
    </form>

    <ToastContainer />
  </div>
);

}

export default Trainer_log;
