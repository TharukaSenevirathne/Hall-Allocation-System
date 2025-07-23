import React, { useState } from "react";
import '../styles/Forms.css';

const AddHallForm = () => {
  const [formData, setFormData] = useState({
    hallName: "",
    mainBuilding: "",
    seats: "",
    acAvailability: "",
    projectorAvailability: "",
    nonAcademicMember: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/halls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.hallName,
          main_building: formData.mainBuilding,
          no_of_seats: Number(formData.seats),
          ac_available: formData.acAvailability === "Yes",
          no_of_projectors: Number(formData.projectorAvailability),
          assigned_tech_officer: formData.nonAcademicMember
        })
      });
      if (response.ok) {
        alert("Hall added successfully!");
        setFormData({
          hallName: "",
          mainBuilding: "",
          seats: "",
          acAvailability: "",
          projectorAvailability: "",
          nonAcademicMember: ""
        });
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.message);
      }
    } catch (error) {
      console.error("Error adding hall:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="fm-form-card">
      <div className="fm-form-header">
        <h2 className="fm-form-title">Add New Hall</h2>
        <div className="fm-form-icon">🏢</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="fm-form-group">
          <input type="text" name="hallName" value={formData.hallName} onChange={handleChange} className="fm-form-input" placeholder=" " required />
          <label className="fm-form-label">Hall Name</label>
          <div className="fm-form-line"></div>
        </div>
        <div className="fm-form-group">
          <select name="mainBuilding" value={formData.mainBuilding} onChange={handleChange} className="fm-form-select" required>
            <option value="">Select Main Building</option>
            <option value="Admin">Admin</option>
            <option value="Mew Lecture Hall Building">New Lecture Hall Building</option>
            <option value="Old Lecture Hall Building">Old Lecture Hall Building</option>
            <option value="DEIE Building">DEIE Building</option>
            <option value="MME Building">MME Building</option>
            <option value="CEE Building">CEE Building</option>
          </select>
          <div className="fm-select-arrow">▼</div>
        </div>
        <div className="fm-form-group">
          <input type="number" name="seats" value={formData.seats} onChange={handleChange} className="fm-form-input" placeholder=" " required />
          <label className="fm-form-label">Number of Seats</label>
          <div className="fm-form-line"></div>
        </div>
        <div className="fm-form-group">
          <select name="acAvailability" value={formData.acAvailability} onChange={handleChange} className="fm-form-select" required>
            <option value="">AC Availability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <div className="fm-select-arrow">▼</div>
        </div>
        <div className="fm-form-group">
          <input type="number" name="projectorAvailability" value={formData.projectorAvailability} onChange={handleChange} className="fm-form-input" placeholder=" " required />
          <label className="fm-form-label">Number of Projectors</label>
          <div className="fm-form-line"></div>
        </div>
        <div className="fm-form-group">
          <input type="text" name="nonAcademicMember" value={formData.nonAcademicMember} onChange={handleChange} className="fm-form-input" placeholder=" " />
          <label className="fm-form-label">Assigned Non-Academic Member</label>
          <div className="fm-form-line"></div>
        </div>
        <div className="fm-form-button-container">
          <button type="submit" className="fm-form-button">
            <span>Confirm</span>
            <div className="fm-button-effect"></div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHallForm;
