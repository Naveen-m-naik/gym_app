import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/TrainerWorkout.css";

function TrainerWorkout() {
  const [workouts, setWorkouts] = useState([]);
  const [username, setUsername] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = {};
      if (username) params.username = username;
      if (fromDate && toDate) {
        params.from = fromDate;
        params.to = toDate;
      }

      const res = await axios.get("http://localhost:5000/trainer/workouts", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setWorkouts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleSearch = () => {
    fetchWorkouts();
  };

  return (
    <div className="trainer-container">
      <h1>Trainer Dashboard</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p>Loading workouts...</p>
      ) : (
        <table className="workout-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Username</th>
              <th>Name</th>
              <th>Exercises</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((w) => (
              <tr key={w._id}>
                <td>{w.date}</td>
                <td>{w.clientId.username}</td>
                <td>{w.clientId.name}</td>
                <td>
                  {w.exercises.map((ex, idx) => (
                    <div key={idx}>
                      {ex.name} - {ex.reps ? `${ex.reps}x${ex.sets}` : `${ex.duration}s`}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TrainerWorkout;
