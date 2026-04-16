import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style/Sidebar.css";

function Sidebar() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    pendingPayments: 0,
    workoutPlans: 12,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📊 FRONTEND DATA:", res.data);

      setStats({
        totalStudents: res.data.totalStudents || 0,
        todayAttendance: res.data.todayAttendance || 0,
        pendingPayments: res.data.pendingPayments || 0,
        workoutPlans: 12,
      });
    } catch (err) {
      console.error("❌ Error fetching stats:", err);

      setStats({
        totalStudents: 0,
        todayAttendance: 0,
        pendingPayments: 0,
        workoutPlans: 12,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="trainer-dashboard">
      <header className="dashboard-header">
        <h1>Alva's College Gym Trainer Dashboard</h1>
        <nav className="top-nav">
          <Link to="/Trainer_dash/trainer_main" className="nav-link">🏠 Home</Link>
          <Link to="/Trainer_dash/attendence" className="nav-link">📅 Attendance</Link>
          <Link to="/Trainer_dash/total_std" className="nav-link">👨‍🎓 Students</Link>
          <Link to="/Trainer_dash/payment" className="nav-link">💳 Payments</Link>
          <Link to="/Trainer_dash/workout" className="nav-link">🏋️ Workout</Link>
          <Link to="/payment/send_mail" className="nav-link">📧 Send Mail</Link>
        </nav>
      </header>

      <section className="welcome-section">
        <h2>Welcome, Trainer 👋</h2>
      </section>

      <section className="stats-section">
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <>
            <div className="stat-card">
              <h3>Total Students</h3>
              <p>{stats.totalStudents}</p>
            </div>

            <div className="stat-card">
              <h3>Today’s Attendance</h3>
              <p>{stats.todayAttendance} Present</p>
            </div>

            <div className="stat-card">
              <h3>Pending Payments</h3>
              <p>{stats.pendingPayments} Students</p>
            </div>

            <div className="stat-card">
              <h3>Workout Plans</h3>
              <p>{stats.workoutPlans}</p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Sidebar;