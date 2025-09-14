import React from "react";
import "../style/trainer.css"; 
import { useNavigate } from "react-router-dom";

function Client_1() {
  const navigate = useNavigate();

  function new_acc() {
    navigate("/login/client_information");
  }

  function login() {
    navigate("/login/client"); 
  }

  return (
    <div className="trainer-container">
      <div className="trainer-box">
        <p className="trainer-text">Create a new account or login</p>
        <div className="trainer-buttons">
          <button className="btn new" onClick={new_acc}>New Account</button>
          <button className="btn login" onClick={login}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Client_1;