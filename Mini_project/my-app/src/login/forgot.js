import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "../style/forgot.css";

function Forgot() {
  const [mail, setMail] = useState({
    username: "",
    code: "",
    newPassword: "",
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // <-- loading state

  const handleSendCode = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/send-code", {
        username: mail.username,
      });
      toast.success("Code sent to your registered email!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
  setLoading(true);
  try {
    const res = await axios.post("http://localhost:5000/verify-code", {
      username: mail.username,
      code: String(mail.code),   // <-- ensure string
    });
    if (res.data.success) {
      toast.success("Code verified!");
      setStep(3);
    } else {
      toast.error("Invalid code");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Error verifying code");
  } finally {
    setLoading(false);
  }
};


  const handleChangePassword = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/change-password", {
        username: mail.username,
        newPassword: mail.newPassword,
      });
      toast.success("Password changed successfully!");
      setStep(1);
      setMail({ username: "", code: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2>Forgot Password</h2>

        {step === 1 && (
          <>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="forgot-input"
              value={mail.username}
              onChange={(e) => setMail({ ...mail, username: e.target.value })}
            />
            <button
              className="forgot-btn"
              onClick={handleSendCode}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              name="code"
              placeholder="Enter the code sent to email"
              className="forgot-input"
              value={mail.code}
              onChange={(e) => setMail({ ...mail, code: e.target.value })}
            />
            <button
              className="forgot-btn"
              onClick={handleVerifyCode}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              className="forgot-input"
              value={mail.newPassword}
              onChange={(e) =>
                setMail({ ...mail, newPassword: e.target.value })
              }
            />
            <button
              className="forgot-btn"
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </>
        )}

        <Link to="/login/trainerlogin" className="back-link">
          ← Back to Login
        </Link>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Forgot;
