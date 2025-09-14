import { useState, useEffect } from "react";
import axios from "axios";
import "../style/attendance.css";

function MyAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login first.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/my-attendance", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAttendance(res.data);
      } catch (err) {
        setError("Failed to fetch attendance");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // ✅ Format date to dd-mm-yyyy (IST timezone)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="attendance-container">
      <h2>📅 My Attendance</h2>
      {attendance.length === 0 ? (
        <p>No attendance records found</p>
      ) : (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a, index) => (
              <tr key={index}>
                <td>{formatDate(a.date)}</td>
                <td
                  className={a.status === "Present" ? "status-present" : "status-absent"}
                >
                  {a.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyAttendance;
