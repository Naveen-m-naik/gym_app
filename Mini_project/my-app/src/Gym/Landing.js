import React from "react";
import "../style/landing.css";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const change = () => navigate("/login/trainer");
  const changeUser = () => navigate("/login/client1");

  return (
    <div className="landing-wrapper">
      <div className="overlay"></div>
      <div className="landing-box">
        <h1 className="fade-down">Gym Zone</h1>
        <h4 className="fade-up">Lift, Sweat, Repeat</h4>
        <p className="select-text fade-in">Select account type to continue</p>

        <div className="options-row">
          <div className="option-card slide-left" onClick={change}>
            <img
              src="https://ifsinstitute.com/wp-content/uploads/2024/01/Fitness-Trainer.webp"
              alt="Trainer"
            />
            <h3>Trainer</h3>
          </div>

          <div className="option-card slide-right" onClick={changeUser}>
            <img
              src="https://www.shutterstock.com/image-vector/fitness-club-ads-healthy-woman-260nw-1193090389.jpg"
              alt="Client"
            />
            <h3>Client</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
