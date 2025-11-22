import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../style/home.css";

function Home() {
  const [trainer, setTrainer] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const token = localStorage.getItem("token"); // saved at login
        if (!token) {
          setError("Please login as trainer to view details.");
          return;
        }

        const res = await axios.get("http://localhost:5000/home_user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrainer(res.data);
      } catch (err) {
        console.error("Error fetching trainer details:", err);
        setError("Failed to fetch trainer details");
      }
    };
    fetchTrainer();
  }, []);

  return (
    <div className="home">
      {/* Navbar */}
      <header className="navbar">
        <h1 className="logo">Alvas Mavinakatte Fitness</h1>
        <nav>
          <Link to="/client_dash/client_main">🏠 Home</Link>
          <Link to="/client_dash/payment">💳 Payment</Link>
          <Link to="/client_dash/attendence_view">🗓️ Attendance</Link>
          <Link to="/client_dash/product">🛒 Products</Link>
          <Link to="/client_dash/client_qr">📷 QR Scan</Link>
          <Link to="/client_dash/workout">📅 Daily Routine</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <h2>Welcome to Alvas Mavinakatte Fitness 💪</h2>
        <p>
          “Push yourself, because no one else is going to do it for you.” <br />
          “Discipline beats motivation. Stay consistent, stay strong.”
        </p>
      </section>

      {/* About */}
      <section className="about">
        <h3>🏋️ About Us</h3>
        <p>
          Alvas Mavinakatte Fitness is more than just a gym — it’s a community
          where discipline meets dedication. Our mission is to provide a space
          where fitness enthusiasts, beginners, and athletes can achieve their
          goals in a motivating and supportive environment.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="why-us">
        <h3>🔥 Why Choose Us?</h3>
        <ul>
          <li>Certified and experienced trainers.</li>
          <li>Personalized workout and diet plans.</li>
          <li>Modern equipment for strength and cardio training.</li>
          <li>Friendly environment that motivates consistency.</li>
          <li>Affordable membership plans.</li>
        </ul>
      </section>

      {/* Facilities */}
      <section className="facilities">
        <h3>🏆 Our Facilities</h3>
        <div className="facility-grid">
          <div className="facility-card">💪 Weight Training</div>
          <div className="facility-card">🏃 Cardio Machines</div>
          <div className="facility-card">🤸 Yoga & Flexibility</div>
          <div className="facility-card">🥗 Nutrition Guidance</div>
          <div className="facility-card">👥 Personal Training</div>
          <div className="facility-card">🧘 Meditation Sessions</div>
        </div>
      </section>

      {/* Trainer Info */}
      <section className="trainer-info">
        <h3>👨‍🏫 Trainer Information</h3>
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : trainer ? (
          <div className="trainer-card">
            <p><strong>Name:</strong> {trainer.Trainername}</p>
            <p><strong>Email:</strong> {trainer.email}</p>
            <p><strong>Phone:</strong> {trainer.phone}</p>
            <p><strong>Gym Name:</strong> {trainer.gymName}</p>
            <p><strong>Specialization:</strong> {trainer.specialization || "Not Provided"}</p>
          </div>
        ) : (
          <p>Loading trainer details...</p>
        )}
      </section>

      {/* Gym Rules */}
      <section className="gym-rules">
        <h3>📋 Gym Rules</h3>
        <ul>
          <li>Wear proper gym attire and shoes.</li>
          <li>Always wipe down equipment after use.</li>
          <li>No outside food or drinks allowed inside.</li>
          <li>Respect other members and trainers.</li>
          <li>Use equipment safely and responsibly.</li>
          <li>Report any damage or issue to the trainer immediately.</li>
        </ul>
      </section>

      {/* Gym Timings */}
      <section className="gym-timings">
        <h3>⏰ Gym Timings</h3>
        <p><strong>Morning:</strong> 6:00 AM – 8:00 AM</p>
        <p><strong>Evening:</strong> 4:30 PM – 8:00 PM</p>
      </section>

      <footer>
        <p>© 2025 Alvas Mavinakatte Fitness | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default Home;
