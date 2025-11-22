import React from "react";

function GymStoreLink() {
  const gymStoreUrl = "https://www.myprotein.co.in/"; // Gym e-commerce link

  // Inline styles
  const containerStyle = {
    textAlign: "center",
    margin: "40px auto",
    padding: "30px",
    maxWidth: "600px",
    borderRadius: "15px",
    background: "rgba(255, 107, 107, 0.1)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
    fontFamily: "Segoe UI, sans-serif",
    color: "#fff",
  };

  const headingStyle = {
    color: "#ff6b6b",
    fontSize: "28px",
    marginBottom: "15px",
  };

  const descStyle = {
    fontSize: "16px",
    marginBottom: "20px",
    lineHeight: "1.5",
    color: "#fff",
  };

  const motivationStyle = {
    fontStyle: "italic",
    marginBottom: "20px",
    color: "#ffd700",
  };

  const buttonStyle = {
    padding: "15px 30px",
    fontSize: "18px",
    borderRadius: "12px",
    background: "#ff6b6b",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  };

  const buttonHoverStyle = {
    background: "#ff4c4c",
    boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
  };

  const [hover, setHover] = React.useState(false);

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Shop Gym Products</h2>
      <div style={motivationStyle}>
        "Train hard, stay consistent, and become the best version of yourself!"
      </div>
      <div style={descStyle}>
        Welcome to the mavinakatte  Alvas College Gym! We specialize in building strength,
        endurance, and overall fitness. Now you can access top-quality gym products to
        complement your workouts and achieve your fitness goals.
      </div>
      <button
        style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
        onClick={() => window.open(gymStoreUrl, "_blank")}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Visit Gym Store
      </button>
    </div>
  );
}

export default GymStoreLink;
