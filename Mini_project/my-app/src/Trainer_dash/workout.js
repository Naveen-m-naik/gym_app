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
      console.log("Error fetching workouts:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts(); // Load today's workouts on first render
  }, []);

  const handleSearch = () => {
    const params = {};
    if (searchText) params.username = searchText;
    if (fromDate && toDate) {
      params.from = fromDate;
      params.to = toDate;
    }
    fetchWorkouts(params);
  };

  const handleClear = () => {
    setSearchText("");
    setFromDate("");
    setToDate("");
    fetchWorkouts(); // Reload today's workouts
  };

  return (
    <div className="trainer-main-container">
      <h1 className="main-title">Trainer Workout Dashboard</h1>

      {/* Big Search Bar */}
      <div className="big-search-box">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="filter-container">
        <div className="filter-item">
          <label>From Date</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="filter-item">
          <label>To Date</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      {/* Buttons */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button className="search-btn" onClick={handleSearch}>Search Workouts</button>
        <button
          className="clear-btn"
          onClick={handleClear}
          style={{ marginLeft: "15px", backgroundColor: "#6c757d" }}
        >
          Clear
        </button>
      </div>

      <h2 className="section-heading">Today's Workouts</h2>

      {loading ? (
        <p className="loading-text">Loading workouts...</p>
      ) : workouts.length === 0 ? (
        <p className="no-data">No workouts found</p>
      ) : (
        <div className="workouts-compact">
          {workouts.map((w) => (
            <div key={w._id} className="compact-card">
              <div className="card-left">
                <div className="student-name">{w.clientId?.name}</div>
                <div className="student-username">@{w.clientId?.username}</div>
                <div className="workout-date">{w.date}</div>
              </div>
              <div className="card-right">
                {w.exercises.map((ex) => (
                  <div key={ex._id} className="exercise-compact">
                    <span className="ex-name">{ex.name}</span>
                    <span className="ex-detail">{ex.reps ? `${ex.reps}×${ex.sets}` : `${ex.duration}s`}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrainerWorkout;
