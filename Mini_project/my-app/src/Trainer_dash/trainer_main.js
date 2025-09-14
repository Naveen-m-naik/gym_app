import React from "react";
import { Link } from "react-router-dom";
import "../style/Sidebar.css";   // 👈 Import external CSS

function Sidebar() {
  const stats = [
    { title: "Total Students", value: 40 },
    { title: "Today’s Attendance", value: "35 Present" },
    { title: "Pending Payments", value: "5 Students" },
    { title: "Workout Plans", value: 12 },
  ];

  return (
    <div className="sidebar">
      {/* Dashboard Title */}
      <h2 className="sidebar-title">Trainer Dashboard</h2>

      {/* ---- Navigation Links ---- */}
      <nav className="sidebar-nav">
       <Link to="/Trainer_dash/trainer_main" className="nav-link">🏠 Home</Link>
        <Link to="/" className="nav-link">📅 Attendance</Link>
        <Link to="/students" className="nav-link">👨‍🎓 Students Joined</Link>
        <Link to="/payments" className="nav-link">💳 Payments</Link>
        <Link to="/workout" className="nav-link">🏋️ Workout Plans</Link>
        <Link to="/diet" className="nav-link">🥗 Diet Plans</Link>
        <Link to="/links" className="nav-link">🔗 Links</Link>
        <Link to="/Gym/rough" className="nav-link">📝 Registered</Link>  {/* ✅ New Link */}
</nav>


      {/* ---- Dashboard Content ---- */}
      <div className="dashboard-content">
        <h1 className="welcome-title">Welcome, Trainer 👋</h1>
        <p className="welcome-text">
          Manage your <span>students</span>, track <span>attendance</span>, handle <span>payments</span>, 
          and push <span>workout/diet plans</span> right here!
        </p>

        {/* Stats Section */}
        <div className="stats-container">
          {stats.map((item, index) => (
            <div key={index} className="stat-card">
              <h2>{item.title}</h2>
              <p>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <ul>
            <li>📅 Mark today’s attendance</li>
            <li>👨‍🎓 Review new student admissions</li>
            <li>💳 Check pending payments</li>
            <li>🏋️ Add a new workout plan</li>
            <li>🥗 Update diet recommendations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
