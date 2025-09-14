import axios from "axios";
import { useState, useEffect } from "react";
import "../style/Rough.css";   // 👈 add this line

function Rough() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login first.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setClients(res.data);
      } catch (err) {
        setError("Failed to fetch client data");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="landing-wrapper">
      <div className="overlay"></div>

      <div className="landing-content">
        <div className="container">
          <h2>Client Details</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : clients.length === 0 ? (
            <p>No clients found</p>
          ) : (
            <table className="client-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Weight</th>
                  <th>Height</th>
                  <th>Gender</th>
                  <th>Place</th>
                  <th>Registered At</th> {/* ✅ Added column */}
                </tr>
              </thead>
              <tbody>
                {clients.map((c, index) => (
                  <tr key={index}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.weight}</td>
                    <td>{c.height}</td>
                    <td>{c.gender}</td>
                    <td>{c.place}</td>
                    <td>
                      {c.registeredAt
                        ? new Date(c.registeredAt).toLocaleString()
                        : c.createdAt
                        ? new Date(c.createdAt).toLocaleString()
                        : "N/A"}
                    </td> {/* ✅ Show formatted date */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Rough;
