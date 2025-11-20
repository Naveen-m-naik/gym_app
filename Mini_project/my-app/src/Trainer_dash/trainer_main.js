import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style/Sidebar.css";

function Sidebar() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    pendingPayments: 0,
    workoutPlans: 12, // static example
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/dashboard/stats");
      setStats({
        totalStudents: res.data.totalStudents,
        todayAttendance: res.data.todayAttendance,
        pendingPayments: res.data.pendingPayments,
        workoutPlans: 12,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="trainer-dashboard">
      {/* ---- Header ---- */}
      <header className="dashboard-header">
        <h1>Alva's College Gym Trainer Dashboard </h1>
        <nav className="top-nav">
          <Link to="/Trainer_dash/trainer_main" className="nav-link">🏠 Home</Link>
          <Link to="/Trainer_dash/attendence" className="nav-link">📅 Attendance</Link>
          <Link to="/Trainer_dash/total_std" className="nav-link">👨‍🎓 Students</Link>
          <Link to="/payments" className="nav-link">💳 Payments</Link>
          <Link to="/workout" className="nav-link">🏋️ Workout</Link>
          <Link to="/diet" className="nav-link">🥗 Diet</Link>
          <Link to="/links" className="nav-link">🔗 Links</Link>
          <Link to="/payment/send_mail" className="nav-link">📧 Send Mail</Link>
        </nav>
      </header>

      {/* ---- Welcome Section ---- */}
      <section className="welcome-section">
        <h2>Welcome, Trainer 👋</h2>
        <p>
          Manage your <span>students</span>, track <span>attendance</span>, handle
          <span> payments</span>, and create <span>workout/diet plans</span> — all in one dashboard.
        </p>
        <p className="motivational-quote">
          "Push yourself because no one else is going to do it for you. 💪"
        </p>
      </section>

      {/* ---- Stats Section ---- */}
      <section className="stats-section">
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
      </section>

      {/* ---- Quick Actions ---- */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <ul>
          <li>📅 Mark today’s attendance</li>
          <li>👨‍🎓 Review new student admissions</li>
          <li>💳 Check pending payments</li>
          <li>🏋️ Add a new workout plan</li>
          <li>🥗 Update diet recommendations</li>
        </ul>
      </section>
    </div>
  );
}

export default Sidebar;
