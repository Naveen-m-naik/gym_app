import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Sidebar() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    pendingPayments: 0,
    workoutPlans: 12,
  });

  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState("");

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats({
        totalStudents: res.data.totalStudents || 0,
        todayAttendance: res.data.todayAttendance || 0,
        pendingPayments: res.data.pendingPayments || 0,
        workoutPlans: 12,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.content}>
        {/* HEADER */}
        <header style={styles.header}>
          <h1 style={styles.logo}>💪 Alva's Gym Trainer</h1>

          <nav style={styles.nav}>
            {[
              { key: "home", text: "Home", link: "/Trainer_dash/trainer_main" },
              { key: "att", text: "Attendance", link: "/Trainer_dash/attendence" },
              { key: "std", text: "Students", link: "/Trainer_dash/total_std" },
              { key: "pay", text: "Payments", link: "/Trainer_dash/payment" },
              { key: "work", text: "Workout", link: "/Trainer_dash/workout" },
              { key: "mail", text: "Send Mail", link: "/payment/send_mail" },
            ].map((item) => (
              <Link
                key={item.key}
                to={item.link}
                style={{
                  ...styles.link,
                  ...(hovered === item.key && styles.linkHover),
                }}
                onMouseEnter={() => setHovered(item.key)}
                onMouseLeave={() => setHovered("")}
              >
                {item.text}
              </Link>
            ))}
          </nav>
        </header>

        {/* WELCOME */}
        <section style={styles.welcome}>
          <h2>Welcome, Trainer 👋</h2>
          <p>Manage your gym smartly and track everything easily 🚀</p>
        </section>

        {/* STATS */}
        <section style={styles.stats}>
          <div style={styles.card}>
            <h3>Total Students</h3>
            <p>{stats.totalStudents}</p>
          </div>

          <div style={styles.card}>
            <h3>Today Attendance</h3>
            <p>{stats.todayAttendance}</p>
          </div>

          <div style={styles.card}>
            <h3>Pending Payments</h3>
            <p>{stats.pendingPayments}</p>
          </div>

          <div style={styles.card}>
            <h3>Workout Plans</h3>
            <p>{stats.workoutPlans}</p>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section style={styles.quickActions}>
          <h3>⚡ Quick Actions</h3>
          <div style={styles.actionGrid}>
            <Link to="/Trainer_dash/attendence" style={styles.actionCard}>📅 Attendance</Link>
            <Link to="/Trainer_dash/workout" style={styles.actionCard}>🏋️ Workout</Link>
            <Link to="/Trainer_dash/payment" style={styles.actionCard}>💳 Payments</Link>
            <Link to="/payment/send_mail" style={styles.actionCard}>📧 Send Mail</Link>
          </div>
        </section>

        {/* MOTIVATION */}
        <section style={styles.motivation}>
          <h3>🔥 Daily Motivation</h3>
          <p>"Discipline is choosing between what you want now and what you want most."</p>
          <p>"Consistency beats intensity."</p>
        </section>

        {/* SUMMARY */}
        <section style={styles.summary}>
          <h3>📊 Today Summary</h3>
          <p>👨‍🎓 Students: {stats.totalStudents}</p>
          <p>✅ Present: {stats.todayAttendance}</p>
          <p>💰 Pending: {stats.pendingPayments}</p>
        </section>
      </div>
    </div>
  );
}

/* 🔥 INLINE CSS */
const styles = {
  page: {
    minHeight: "100vh",
    backgroundImage: "url('https://images.unsplash.com/photo-1594737625785-a6cbdabd333c')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    color: "white",
    fontFamily: "Poppins, sans-serif",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.8)",
  },

  content: {
    position: "relative",
    zIndex: 1,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 40px",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(10px)",
  },

  logo: {
    color: "#00ffcc",
    fontSize: "22px",
  },

  nav: {
    display: "flex",
    gap: "15px",
  },

  link: {
    color: "white",
    padding: "8px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    transition: "0.3s",
  },

  linkHover: {
    background: "linear-gradient(45deg,#00ffcc,#00c3ff)",
    color: "#000",
    boxShadow: "0 0 10px #00ffcc",
  },

  welcome: {
    textAlign: "center",
    padding: "30px",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    padding: "20px",
  },

  card: {
    padding: "20px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    textAlign: "center",
  },

  quickActions: {
    textAlign: "center",
    padding: "20px",
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "10px",
  },

  actionCard: {
    padding: "15px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "white",
    background: "linear-gradient(135deg,#00ffcc,#00c3ff)",
    fontWeight: "bold",
    transition: "0.3s",
  },

  motivation: {
    marginTop: "20px",
    padding: "20px",
    textAlign: "center",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "12px",
  },

  summary: {
    marginTop: "20px",
    padding: "20px",
    textAlign: "center",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "12px",
  },
};

export default Sidebar;