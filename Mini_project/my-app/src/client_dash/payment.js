import React, { useState } from "react";
import axios from "axios";

function PaymentButton() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // ✅ Get token from existing login
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ Please login to make payment");
        return;
      }

      // CREATE ORDER
      const orderRes = await axios.post(
        "http://localhost:5000/payment/create-order",
        { amount: 500 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const order = orderRes.data;

      // RAZORPAY OPTIONS
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Gym Monthly Payment",
        description: "Membership Payment",
        order_id: order.id,

        handler: async function (response) {
          // VERIFY PAYMENT
          try {
            await axios.post(
              "http://localhost:5000/payment/verify-payment",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                amount: 500, // optional for email
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            alert("✅ Payment Successful!");
          } catch (err) {
            console.error(err);
            alert("❌ Payment verification failed!");
          }
        },

        theme: { color: "#28a745" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Create order error:", err);
      alert(err.response?.data?.error || "❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading} style={{ padding: "12px 25px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
      {loading ? "Processing..." : "Pay Now ₹500"}
    </button>
  );
}

export default PaymentButton;
