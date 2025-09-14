import React from "react";
import { QRCodeCanvas } from "qrcode.react";

function GymQR() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>📷 Scan to Mark Attendance</h2>
      <QRCodeCanvas
        value="http://localhost:3000/client_dash/client_qr" // 👈 QR target page
        size={220}
        level="H"
        includeMargin={true}
      />
      <p>👉 Scan this QR at the gym to mark your attendance.</p>
    </div>
  );
}

export default GymQR;
