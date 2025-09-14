import React, { useEffect, useState } from "react";
import axios from "axios";

function Gym_avl() {
  const [gyms, setGyms] = useState(null);

  useEffect(() => {
    async function fetchGyms() {
      try {
        const res = await axios.get("http://localhost:5000/gym_avl");
        setGyms(res.data);
      } catch (err) {
        alert(err.response?.data?.error || "Error fetching gyms");
      }
    }
    fetchGyms();
  }, []);

  return (
    <div className="gyms">
      {gyms ? (
        <ul>
          {gyms.map((gym,index) => (
            <li key={index}>
              {gym.Trainername} - {gym.gymName} - {gym.email} - ₹{gym.fees}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading…</p>
      )}
    </div>
  );
}

export default Gym_avl;
