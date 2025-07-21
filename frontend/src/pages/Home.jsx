import React from "react"
import { useNavigate } from "react-router-dom"
import "../styles/Home.css"
const Home = () => {
  const navigate = useNavigate()
  return (
    <div
      className="home-container"
    >
      <div className="overlay">
        <h1 className="welcome-text">Welcome to Allocate</h1>
        <div className="subtitle">
          Hall allocation & Event Management System of Sabaragamuwa University of Sri Lanka
        </div>
        <div className="description">
          <p>
            This is the home page of the Allocate system, where you can manage
            hall allocations and events efficiently.
          </p>
        </div>
        <div className="buttons">
          <button className="btn btn-timetable"onClick={() => navigate("/time-table")}>See Time table</button>
          <button className="btn btn-login" onClick={() => navigate("/login")}>
            Log-in
          </button>
        </div>
      </div>
      <div className="notices-box">
        <h3>Special Notices</h3>
        <div className="notice-content">
          <p>No current notices at this time.</p>
          <p>Check back later for updates.</p>
        </div>
      </div>
    </div>
  )
}
export default Home