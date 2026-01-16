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
        key:  process.env.SECRET_KEY, // Replace with your key
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
        theme: { color: "#28a745" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.error || "❌ Something went wrong!");
      console.error(err);
    }
  };

  // Inline styles
  const cardStyle = {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "15px",
    background: "rgba(40, 167, 69, 0.15)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
    textAlign: "center",
    fontFamily: "Segoe UI, sans-serif",
    color: "#fff",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#28a745",
  };

  const motivationStyle = {
    fontStyle: "italic",
    marginBottom: "15px",
    color: "#ffd700",
  };

  const descStyle = {
    fontSize: "16px",
    color: "#fff",
    marginBottom: "20px",
    lineHeight: "1.4",
  };

  const buttonStyle = {
    padding: "12px 25px",
    background: "#28a745",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "0.3s",
  };

  const [hover, setHover] = React.useState(false);

  const buttonHoverStyle = {
    background: "#218838",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  };

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>Gym Membership Payment</div>
      <div style={motivationStyle}>
        "Stay consistent, train hard, and watch your transformation!"
      </div>
      <div style={descStyle}>
        Join the Mavinakatte Alvas College Gym community. Pay your monthly membership
        securely and get full access to our gym facilities and expert training.
        Click the button below to complete your payment of <b>₹500</b>.
      </div>
      <button
        style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
        onClick={handlePayment}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Pay Now ₹500
      </button>
    </div>
  );
}

export default PaymentButton;
