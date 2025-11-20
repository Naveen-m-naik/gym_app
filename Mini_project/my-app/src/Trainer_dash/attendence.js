import React, { useEffect, useState } from "react";
import axios from "axios";

function TrainerAttendanceView() {
  const [attendances, setAttendances] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const token = localStorage.getItem("token"); // JWT token

  // Fetch all attendance (optionally by date range)
  const fetchAll = async (from, to) => {
    let url = "http://localhost:5000/attendence/view";
    if (from && to) url += `?from=${from}&to=${to}`;
    
    const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    setAttendances(res.data);
  };

  // Search by username
  const searchByName = async () => {
    if (!searchName) return fetchAll(); // if empty, show all
    const res = await axios.get(
      `http://localhost:5000/attendence/search?username=${searchName}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAttendances(res.data);
  };

  // Filter by date range
  const filterByDate = async () => {
    if (!fromDate || !toDate) return;
    fetchAll(fromDate, toDate);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2 style={{ marginBottom: "20px" }}>Attendance Dashboard</h2>

      {/* Search by Name */}
      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Search by Trainer Name</h3>
        <input
          type="text"
          placeholder="Enter trainer username"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ padding: "8px", width: "250px", marginRight: "10px", borderRadius: "5px" }}
        />
        <button onClick={searchByName} style={{ padding: "8px 15px", borderRadius: "5px" }}>
          Search
        </button>
        <button
          onClick={() => { setSearchName(""); fetchAll(); }}
          style={{ padding: "8px 15px", marginLeft: "10px", borderRadius: "5px", backgroundColor: "#ccc" }}
        >
          Reset
        </button>
      </div>

      {/* Filter by Date Range */}
      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Filter by Date</h3>
        <label>From: </label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <label>To: </label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={filterByDate} style={{ padding: "8px 15px", borderRadius: "5px" }}>Filter</button>
        <button
          onClick={() => { setFromDate(""); setToDate(""); fetchAll(); }}
          style={{ padding: "8px 15px", marginLeft: "10px", borderRadius: "5px", backgroundColor: "#ccc" }}
        >
          Reset
        </button>
      </div>

      {/* Attendance Table */}
      <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#a12121ff" }}>
          <tr>
            <th>Username</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendances.length > 0 ? (
            attendances.map((item) => (
              <tr key={item._id}>
                <td>{item.username}</td>
                <td>{item.date}</td>
                <td>{item.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No Records Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TrainerAttendanceView;
