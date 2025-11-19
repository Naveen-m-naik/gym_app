import React from "react";
import { Link } from "react-router-dom";
import "../style/Sidebar.css";

function Sidebar() {
  const stats = [
    { title: "Total Students", value: 40 },
    { title: "Today’s Attendance", value: "35 Present" },
    { title: "Pending Payments", value: "5 Students" },
    { title: "Workout Plans", value: 12 },
  ];

  return (
    <div className="trainer-dashboard">
      {/* ---- Header ---- */}
      <header className="dashboard-header">
        <h1>Trainer Dashboard 👟</h1>

        {/* Simple Top Navigation */}
        <nav className="top-nav">
          <Link to="/Trainer_dash/trainer_main" className="nav-link">🏠 Home</Link>
          <Link to="/attendance" className="nav-link">📅 Attendance</Link>
          <Link to="/students" className="nav-link">👨‍🎓 Students</Link>
          <Link to="/payments" className="nav-link">💳 Payments</Link>
          <Link to="/workout" className="nav-link">🏋️ Workout</Link>
          <Link to="/diet" className="nav-link">🥗 Diet</Link>
          <Link to="/links" className="nav-link">🔗 Links</Link>
          <Link to="/registered" className="nav-link">📝 Registered</Link>

          {/* ⭐ Added NEW Link Here */}
          <Link to="/payment/send_mail" className="nav-link">📧 Send Mail</Link>
        </nav>
      </header>

      {/* ---- Welcome Text ---- */}
      <section className="welcome-section">
        <h2>Welcome, Trainer 👋</h2>
        <p>
          Manage your <span>students</span>, track <span>attendance</span>, handle
          <span> payments</span>, and create <span>workout/diet plans</span> — all in one place.
        </p>
      </section>

      {/* ---- Stats Cards ---- */}
      <section className="stats-section">
        {stats.map((item, index) => (
          <div key={index} className="stat-card">
            <h3>{item.title}</h3>
            <p>{item.value}</p>
          </div>
        ))}
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
