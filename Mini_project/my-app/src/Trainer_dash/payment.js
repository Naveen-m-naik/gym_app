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
    <div style={{ padding: "20px" }}>
      <h2>💳 Trainer Payment Dashboard</h2>

      <table border="1" cellPadding="10">
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
          {payments.map((p) => (
            <tr key={p._id}>
              <td>{p.userId?.username}</td>
              <td>{p.userId?.email}</td>
              <td>₹{p.amount}</td>
              <td style={{ color: p.status === "paid" ? "green" : "red" }}>
                {p.status}
              </td>
              <td>{p.month}/{p.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TrainerPayments;