import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/TodayWorkout.css";

function TodayWorkout() {
  const [workout, setWorkout] = useState([]);
  const [muscle, setMuscle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/workout/today", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const exercises = res.data.exercises || [];
        setWorkout(exercises);

        // muscle detection
        if (exercises.length > 0) {
          const name = exercises[0].name;

          if (/Curls|Hammer|EZ/.test(name)) setMuscle("Biceps");
          else if (/Tricep|Dips|Kickbacks/.test(name)) setMuscle("Triceps");
          else if (/Bench|Push|Chest/.test(name)) setMuscle("Chest");
          else if (/Row|Pull|Lat|Deadlift/.test(name)) setMuscle("Back");
          else if (/Squat|Lunges|Leg/.test(name)) setMuscle("Legs");
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
      <h1 className="title">🔥 Today's Workout</h1>

      {muscle && (
        <h2 className={`muscle muscle-${muscle.toLowerCase()}`}>
          Muscle of the Day: {muscle}
        </h2>
      )}

      <div className="exercises-grid">
        {workout.length === 0 ? (
          <p className="no-workout">No workout assigned today</p>
        ) : (
          workout.map((ex, idx) => (
            <div key={idx} className="exercise-card">
              <h3 className="exercise-name">{ex.name}</h3>

              <p className="exercise-detail">
                {ex.reps && ex.sets
                  ? `${ex.reps} reps x ${ex.sets} sets`
                  : ex.duration
                  ? `${ex.duration}s`
                  : ""}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TodayWorkout;