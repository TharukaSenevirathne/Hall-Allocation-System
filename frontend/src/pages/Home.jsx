import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("allocate-home-active");
    return () => {
      document.body.classList.remove("allocate-home-active");
    };
  }, []);

  return (
    <div className="allocate-home-container">
      <div className="allocate-home-background">
        <div className="allocate-gradient-overlay"></div>
      </div>
      <div className="allocate-content-wrapper">
        <div className="allocate-main-content">
          <h1 className="allocate-title allocate-animate-element">Welcome to Allocate</h1>
          <div className="allocate-subtitle allocate-animate-element">
            Hall allocation & Event Management System of Sabaragamuwa University of Sri Lanka
          </div>
          <div className="allocate-description allocate-animate-element">
            <p>
              This is the home page of the Allocate system, where you can manage
              hall allocations and events efficiently.
            </p>
          </div>
          <div className="allocate-button-group allocate-animate-element">
            <button
              className="allocate-primary-button"
              onClick={() => navigate("/time-table")}
            >
              <span className="allocate-button-text">See Time table</span>
              <span className="allocate-button-icon">→</span>
            </button>
            <button
              className="allocate-secondary-button"
              onClick={() => navigate("/login")}
            >
              <span className="allocate-button-text">Log in</span>
              <span className="allocate-button-icon">→</span>
            </button>
          </div>
        </div>
        <div className="allocate-notices-panel allocate-animate-element">
          <div className="allocate-notices-content">
            <h3>Special Notices</h3>
            <div className="allocate-notice-items">
              <p>No current notices at this time.</p>
              <p>Check back later for updates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
