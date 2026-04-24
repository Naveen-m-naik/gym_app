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
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.container}>
        <h2 style={styles.heading}>💪 Invest in Your Fitness</h2>

        <p style={styles.subText}>
          "Push yourself, because no one else is going to do it for you."
        </p>

        <p style={styles.desc}>
          Every payment is a commitment to your health. Start your journey today 🚀
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Pay Now ₹500"}
        </button>

        <p style={styles.footer}>
          🔒 Secure Payment | 100% Trusted
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    width: "100%",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1554284126-aa88f22d8b74')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    background: "rgba(0,0,0,0.6)",
  },

  container: {
    position: "relative",
    maxWidth: "400px",
    padding: "30px",
    textAlign: "center",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },

  heading: {
    marginBottom: "10px",
    fontSize: "26px",
    fontWeight: "bold",
  },

  subText: {
    fontStyle: "italic",
    fontSize: "14px",
    marginBottom: "10px",
    color: "#ddd",
  },

  desc: {
    fontSize: "15px",
    marginBottom: "25px",
  },

  button: {
    padding: "12px 30px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "linear-gradient(45deg, #28a745, #00c853)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    transition: "0.3s",
  },

  footer: {
    marginTop: "15px",
    fontSize: "12px",
    color: "#ccc",
  },
};

export default PaymentButton;