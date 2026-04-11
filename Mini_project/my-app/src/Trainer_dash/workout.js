import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/TrainerWorkout.css";

function TrainerWorkout() {
  const [workouts, setWorkouts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = async (params = {}) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/trainer/workouts", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setWorkouts(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts(); // today on load
  }, []);

  const handleSearch = () => {
    const params = {};
    if (searchText) params.username = searchText;
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    fetchWorkouts(params);
  };

  const handleClear = () => {
    setSearchText("");
    setFromDate("");
    setToDate("");
    fetchWorkouts();
  };

  return (
    <div className="trainer-page">

      {/* TITLE */}
      <h1 className="title">🏋️ Trainer Workout Dashboard</h1>

      {/* SEARCH BAR */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button className="clear" onClick={handleClear}>Clear</button>
      </div>

      {/* DATE FILTER */}
      <div className="date-section">
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </div>

      {/* TABLE */}
      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : workouts.length === 0 ? (
          <p>No workouts found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Date</th>
                <th>Exercises</th>
              </tr>
            </thead>

            <tbody>
              {workouts.map((w) => (
                <tr key={w._id}>
                  <td>{w.clientId?.name}</td>
                  <td>{w.clientId?.username}</td>
                  <td>{w.date}</td>
                  <td>
                    {w.exercises.map((ex, i) => (
                      <div key={i}>
                        {ex.name} -{" "}
                        {ex.reps ? `${ex.reps}x${ex.sets}` : `${ex.duration}s`}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TrainerWorkout;