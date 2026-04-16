import React, { useState } from "react";
import axios from "axios";

function PaymentButton() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ Please login first");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/payment/pay",
        { amount: 500 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Payment Successful!");
      console.log(res.data);

      // 🔥 reload to unlock dashboard
      window.location.reload();

    } catch (err) {
      console.error(err);

      if (err.response?.data?.msg === "Already paid this month") {
        alert("⚠️ You already paid for this month");
      } else {
        alert("❌ Payment failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      style={{
        padding: "12px 25px",
        background: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      {loading ? "Processing..." : "Pay Now ₹500"}
    </button>
  );
}

export default PaymentButton;