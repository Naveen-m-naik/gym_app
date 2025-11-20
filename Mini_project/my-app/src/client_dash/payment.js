import React from "react";
import axios from "axios";

function PaymentButton({ user }) {
  const handlePayment = async () => {
    try {
      const orderRes = await axios.post(
        "http://localhost:5000/payment/create-order",
        { userId: user._id, amount: 500 },
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      const order = orderRes.data;

      const options = {
        key: "rzp_test_1234567890abcdef", // Replace with your key
        amount: order.amount,
        currency: "INR",
        name: "Gym Monthly Payment",
        description: "Membership Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/payment/verify-payment",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                userEmail: user.email,
                amount: 500,
              },
              { headers: { Authorization: localStorage.getItem("token") } }
            );

            if (verifyRes.data.success) alert("✅ Payment Successful!");
            else alert(verifyRes.data.message || "❌ Payment verification failed!");
          } catch (err) {
            alert(err.response?.data?.error || "❌ Verification failed!");
            console.error(err);
          }
        },
        prefill: { name: user.name, email: user.email, contact: user.phone },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.error || "❌ Something went wrong!");
      console.error(err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        padding: "10px 20px",
        background: "#28a745",
        color: "white",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      Pay Now ₹500
    </button>
  );
}

export default PaymentButton;
