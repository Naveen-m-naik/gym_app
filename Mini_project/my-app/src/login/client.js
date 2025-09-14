import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/client.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Client() {
  const navigate = useNavigate();
  const [client, setClient] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/client_login", client);

      if (res.data.success) {
        // ✅ Save token
        localStorage.setItem("token", res.data.token);

        // ✅ Show green toast
        toast.success(res.data.message || "Login successful", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Navigate to client dashboard
        navigate("/client_dash/client_main");
      } else {
        // ❌ Show red toast on failure
        toast.error(res.data.message || "Login failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login is not successful", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Login error:", err);
    }
  };

return (
  <div className="landing-wrapper">
    <div className="overlay"></div>

    <div className="landing-content">
      <form onSubmit={handleSubmit} className="client-form">
        <p>Login</p>

        <div className="input-row">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={client.username}
            onChange={handleChange}
            autoComplete="new-username"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={client.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>

        <button type="submit">Login</button>

        <div className="extra-links">
          <Link to="/login/forgot" className="forgot-link">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>

    <ToastContainer />
  </div>
);

}

export default Client;
