import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/QrScan.css";
import { useNavigate } from "react-router-dom";

function QrScan() {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);

  // Handle QR Scan
  const handleScan = async (result) => {
    if (!!result && !scanned) {
      setScanned(true);
      console.log("QR Result:", result?.text);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Unauthorized! Please login again.", { autoClose: 3000 });
          return;
        }

        // ✅ send request without username, backend extracts from token
        const res = await axios.post(
          "http://localhost:5000/mark",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(res.data.message, { autoClose: 3000 });
        setTimeout(() => {
          navigate("/client_dash/client_main");
        }, 1000);
      } catch (err) {
        toast.error(err.response?.data?.message || "Error marking attendance", {
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="qrscan-container">
      <h2>📷 Scan QR & Mark Attendance</h2>

      {!scanned ? (
        <div className="qr-box">
          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={(result, error) => {
              if (!!result) handleScan(result);
              if (!!error) console.warn(error);
            }}
            style={{ width: "100%" }}
          />
        </div>
      ) : (
        <h3 className="success-message">✅ QR Scanned Successfully</h3>
      )}

      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
}

export default QrScan;
