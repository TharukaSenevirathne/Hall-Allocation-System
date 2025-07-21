import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const UpdateStudentForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const { id } = useParams(); // student ID from URL

  // Fetch student data if ID is provided via URL
  useEffect(() => {
    const fetchStudent = async () => {
      if (id) {
        try {
          const res = await fetch(`http://localhost:5000/api/students/${id}`);
          const student = await res.json();

          setSelectedStudentId(student.user_id);
          setFormData({
            name: student.name,
            reg_no: student.reg_no,
            email: student.email,
            contact_no: student.contact_no,
            department: student.department,
            batch: student.batch,
            purpose: student.purpose || "None",
            society_name: student.society_name || "",
            lecturer_in_charge: student.lecturer_in_charge,
            password: ""
          });
        } catch (err) {
          console.error("Failed to fetch student:", err);
        }
      }
    };

    fetchStudent();
  }, [id]);

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/students/search?query=${searchQuery}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

 const handleSelect = async (student) => {
  try {
    const res = await fetch(`http://localhost:5000/api/students/${student.user_id}`);
    const fullStudent = await res.json();

    setSelectedStudentId(fullStudent.user_id);
    setFormData({
      name: fullStudent.name,
      reg_no: fullStudent.reg_no,
      email: fullStudent.email,
      contact_no: fullStudent.contact_no,
      department: fullStudent.department,
      batch: fullStudent.batch,
      purpose: fullStudent.purpose || "None",
      society_name: fullStudent.society_name || "",
      lecturer_in_charge: fullStudent.lecturer_in_charge,
      password: ""
    });

    setSearchResults([]);
    setSearchQuery("");
  } catch (err) {
    console.error("❌ Failed to fetch full student data:", err);
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/students/${selectedStudentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Student updated successfully!");
        setFormData(null);
        setSelectedStudentId(null);
      } else {
        alert("Error: " + (data.error || "Failed to update student"));
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="admin-form-card">
      <h2 className="admin-form-title">Update Student</h2>

      {/* Search */}
      <div className="admin-form-group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Name or Reg No"
          className="admin-form-input"
        />
        <button type="button" className="admin-confirm-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <ul className="search-dropdown">
          {searchResults.map((student) => (
            <li key={student.user_id} onClick={() => handleSelect(student)}>
              {student.name} ({student.reg_no})
            </li>
          ))}
        </ul>
      )}

      {/* Update Form */}
      {formData && (
        <form onSubmit={handleUpdate}>
          <div className="admin-form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="admin-form-input"
              required
            />
          </div>

          <div className="admin-form-group">
            <input
              type="text"
              name="reg_no"
              value={formData.reg_no}
              onChange={handleChange}
              placeholder="Reg. Number"
              className="admin-form-input"
              required
            />
          </div>

          {["email", "contact_no", "lecturer_in_charge"].map((field) => (
            <div className="admin-form-group" key={field}>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                className="admin-form-input"
                required
              />
            </div>
          ))}

          {/* Department */}
          <div className="admin-form-group">
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="admin-form-input"
              required
            >
              <option value="">Select Department</option>
              <option value="Common">Common</option>
              <option value="Computer">Computer</option>
              <option value="EIE">EIE</option>
              <option value="CEE">CEE</option>
              <option value="MENA">MENA</option>
              <option value="MME">MME</option>
            </select>
          </div>

          {/* Batch */}
          <div className="admin-form-group">
            <select
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              className="admin-form-input"
              required
            >
              <option value="">Select Batch</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <option value="25">25</option>
              <option value="26">26</option>
            </select>
          </div>

          {/* Purpose */}
          <div className="admin-form-group">
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="admin-form-input"
            >
              <option value="">Select Purpose</option>
              <option value="None">None</option>
              <option value="Chair">Chair</option>
              <option value="Rep">Rep</option>
            </select>
          </div>

          {/* Society name if Chair */}
          {formData.purpose === "Chair" && (
            <div className="admin-form-group">
              <input
                type="text"
                name="society_name"
                value={formData.society_name}
                onChange={handleChange}
                placeholder="Society Name"
                className="admin-form-input"
                required
              />
            </div>
          )}

          {/* Password Reset */}
          <div className="admin-form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Reset Password (optional)"
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-button-container">
            <button type="submit" className="admin-confirm-button">
              Update Student
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateStudentForm;
