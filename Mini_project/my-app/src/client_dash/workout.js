import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/TodayWorkout.css";

function TodayWorkout() {
  const [workout, setWorkout] = useState([]);
  const [muscle, setMuscle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // token after login

    axios
      .get("http://localhost:5000/workout/today", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const exercises = res.data.exercises || [];
        setWorkout(exercises);

        // Detect muscle from first exercise name
        if (exercises.length > 0) {
          const name = exercises[0].name;
          if (/Curls|Hammer|Concentration|EZ/.test(name)) setMuscle("Biceps");
          else if (/Tricep|Dips|Skull|Kickbacks|Overhead|Close-Grip|Rope/.test(name)) setMuscle("Triceps");
          else if (/Push-ups|Bench|Incline|Chest|Cable|Decline/.test(name)) setMuscle("Chest");
          else if (/Pull-ups|Rows|Lat|Deadlift|Seated|T-Bar/.test(name)) setMuscle("Back");
          else if (/Squats|Lunges|Leg|Calf|Bulgarian/.test(name)) setMuscle("Legs");
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading">Loading today's workout...</p>;

  return (
    <div className="workout-container">
      <h1 className="title">Today's Workout</h1>
      {muscle && <h2 className={`muscle muscle-${muscle.toLowerCase()}`}>Muscle of the Day: {muscle}</h2>}

      <div className="exercises-grid">
        {workout.map((ex, idx) => (
          <div key={idx} className="exercise-card">
            <h3 className="exercise-name">{ex.name}</h3>
            <p className="exercise-detail">
              {ex.reps && ex.sets ? `${ex.reps} reps x ${ex.sets} sets` : ex.duration ? `${ex.duration}s` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodayWorkout;
