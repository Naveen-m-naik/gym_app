import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/SendEmail.css";

function SendEmail() {
  const navigate = useNavigate();

  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false); // loading state

  const handleChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleSendEmail = async () => {
    if (!emailData.to || !emailData.subject || !emailData.message) {
      setStatus("❗ Please fill in all fields");
      return;
    }

    setStatus("Sending...");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/email/send-trainer-email",
        emailData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      setStatus("✅ Email sent successfully!");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        setStatus("❌ Unauthorized. Please login again.");
      } else {
        setStatus(err.response?.data?.message || "❌ Failed to send email.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="email-container">
      <div className="email-card">
        <h2>Send Email</h2>

        <input
          type="email"
          name="to"
          placeholder="Recipient Email"
          value={emailData.to}
          onChange={handleChange}
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={emailData.subject}
          onChange={handleChange}
        />

        <textarea
          name="message"
          placeholder="Message"
          value={emailData.message}
          onChange={handleChange}
        />

        {/* SEND BUTTON */}
        <button
          onClick={handleSendEmail}
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send Email"}
        </button>

        {/* STATUS MESSAGE */}
        {status && (
          <p
            style={{
              marginTop: "10px",
              color: status.includes("❌") ? "red" : status.includes("Sending") ? "blue" : "green",
            }}
          >
            {status}
          </p>
        )}

        {/* HOME BUTTON */}
        <button
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "14px",
            background: "#ff7f50",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background 0.3s ease, transform 0.2s ease",
          }}
          onClick={() => navigate("/Trainer_dash/trainer_main")}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default SendEmail;
