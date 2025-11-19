import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // for navigation
import "../style/SendEmail.css";


function SendEmail() {
  const navigate = useNavigate(); // hook for navigation
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState(""); // status message

  const handleChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleSendEmail = async () => {
    // Simple validation
    if (!emailData.to || !emailData.subject || !emailData.message) {
      setStatus("Please fill in all fields");
      return;
    }

    console.log("DEBUG: Sending email data:", emailData);

    try {
      const token = localStorage.getItem("token"); // JWT token if required

      const response = await axios.post(
        "http://localhost:5000/email/send-trainer-email",
        emailData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("DEBUG: Response from backend:", response.data);
      setStatus("Email sent successfully!");
    } catch (err) {
      console.error(
        "DEBUG: Error response:",
        err.response?.data || err.message
      );

      if (err.response?.status === 401) {
        setStatus("Unauthorized. Please login first.");
      } else {
        setStatus(
          err.response?.data?.message || "Error sending email. Check console."
        );
      }
    }
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
        <button onClick={handleSendEmail}>Send Email</button>
        {status && <p style={{ marginTop: "10px", color: "green" }}>{status}</p>}

        {/* Home button to navigate back */}
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
          onClick={() => navigate("/Trainer_dash/trainer_main")} // change path if needed
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default SendEmail;
