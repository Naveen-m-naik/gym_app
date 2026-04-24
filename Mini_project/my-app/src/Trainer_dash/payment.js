import React, { useEffect, useState } from "react";
import axios from "axios";

function TrainerPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/payment/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.content}>
        <h2 style={styles.title}>💳 Trainer Payment Dashboard</h2>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Month</th>
              </tr>
            </thead>

            <tbody>
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p._id} style={styles.row}>
                    <td>{p.userId?.username}</td>
                    <td>{p.userId?.email}</td>
                    <td style={styles.amount}>₹{p.amount}</td>

                    <td
                      style={
                        p.status === "paid"
                          ? styles.paid
                          : styles.pending
                      }
                    >
                      {p.status}
                    </td>

                    <td>
                      {p.month}/{p.year}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={styles.noData}>
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* 🔥 STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1594737625785-a6cbdabd333c')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    fontFamily: "Poppins, sans-serif",
    color: "white",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.8)",
  },

  content: {
    position: "relative",
    zIndex: 1,
    padding: "30px",
  },

  title: {
    textAlign: "center",
    fontSize: "30px",
    marginBottom: "25px",
    background: "linear-gradient(90deg,#00ffcc,#00c3ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  tableContainer: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "15px",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  row: {
    transition: "0.3s",
  },

  amount: {
    color: "#00ffcc",
    fontWeight: "bold",
  },

  paid: {
    color: "#00ff88",
    fontWeight: "bold",
  },

  pending: {
    color: "#ff4444",
    fontWeight: "bold",
  },

  noData: {
    textAlign: "center",
    padding: "20px",
  },
};

export default TrainerPayments;