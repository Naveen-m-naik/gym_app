import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../style/home.css";

function Home() {
  const [trainer, setTrainer] = useState(null);
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view details.");
          return;
        }

        const res = await axios.get("http://localhost:5000/home_user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrainer(res.data.trainer);
        setClient(res.data.client);

      } catch (err) {
        console.error(err);
        setError("Failed to fetch details");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">

      {/* Navbar */}
      <header className="navbar">
        <h1 className="logo">Alvas Mavinakatte Fitness 💪</h1>
        <nav>
          <Link to="/client_dash/client_main">🏠 Home</Link>
          <Link to="/client_dash/payment1">💳 Payment</Link>
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
          where discipline meets dedication. We help you build strength,
          confidence, and a healthy lifestyle.
        </p>
      </section>

      {/* WHY US */}
      <section className="why-us">
        <h3>🔥 Why Choose Us?</h3>
        <ul>
          <li>✔ Certified trainers</li>
          <li>✔ Personalized workout plans</li>
          <li>✔ Modern equipment</li>
          <li>✔ Friendly environment</li>
        </ul>
      </section>

      {/* CLIENT INFO - TOP */}
      <section className="client-info">
        <h3>👤 Client Information</h3>

        {client ? (
          <div className="trainer-card">
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
            <p><strong>Place:</strong> {client.place}</p>
            <p><strong>Weight:</strong> {client.weight || "Not Provided"} kg</p>
            <p><strong>Height:</strong> {client.height || "Not Provided"} cm</p>
            <p><strong>Gender:</strong> {client.gender || "Not Provided"}</p>
          </div>
        ) : (
          <p>Loading client details...</p>
        )}
      </section>

      {/* MOTIVATION - MIDDLE */}
      <section className="motivation">
        <h3>🔥 Daily Motivation</h3>
        <p>
          “Push yourself, because no one else is going to do it for you.” <br />
          “Discipline beats motivation.” <br />
          “Success starts with self-discipline.”
        </p>
      </section>

      {/* TRAINER INFO - BOTTOM */}
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

      {/* Facilities */}
      <section className="facilities">
        <h3>🏆 Facilities</h3>
        <div className="facility-grid">
          <div className="facility-card">💪 Weight Training</div>
          <div className="facility-card">🏃 Cardio</div>
          <div className="facility-card">🧘 Yoga</div>
          <div className="facility-card">🥗 Nutrition</div>
        </div>
      </section>

      {/* Gym Rules */}
      <section className="gym-rules">
        <h3>📋 Gym Rules</h3>
        <ul>
          <li>Wear proper gym attire</li>
          <li>Clean equipment after use</li>
          <li>Respect others</li>
        </ul>
      </section>

      {/* Timings */}
      <section className="gym-timings">
        <h3>⏰ Timings</h3>
        <p>Morning: 6:00 AM – 8:00 AM</p>
        <p>Evening: 4:30 PM – 8:00 PM</p>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 Alvas Mavinakatte Fitness | Stay Strong 💪</p>
      </footer>

    </div>
  );
}

export default Home;