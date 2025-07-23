import React, { useState, useEffect } from "react";

const UpdateStudentForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const id = null;

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
    <div className="fm-form-card">
      <div className="fm-form-header">
        <h2 className="fm-form-title">Update Student</h2>
        <div className="fm-form-icon">👨‍🎓</div>
      </div>

      <div className="fm-form-group fm-search-group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="fm-form-input"
          placeholder="Search by Name or Reg No"
        />
        <button type="button" className="fm-form-button fm-search-button" onClick={handleSearch}>
          <span>Search</span>
          <div className="fm-button-effect"></div>
        </button>
      </div>

      {searchResults.length > 0 && (
        <ul className="fm-search-dropdown">
          {searchResults.map((student) => (
            <li key={student.user_id} onClick={() => handleSelect(student)}>
              {student.name} ({student.reg_no})
            </li>
          ))}
        </ul>
      )}

      {formData && (
        <form onSubmit={handleUpdate}>
          {[
            ["name", "Name"],
            ["reg_no", "Registration Number"],
            ["email", "Email"],
            ["contact_no", "Contact Number"],
            ["lecturer_in_charge", "Lecturer in Charge"],
          ].map(([name, label]) => (
            <div className="fm-form-group" key={name}>
              <input
                type={name === "email" ? "email" : "text"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="fm-form-input"
                placeholder=" "
                required
              />
              <label className="fm-form-label">{label}</label>
              <div className="fm-form-line"></div>
            </div>
          ))}

          <div className="fm-form-group">
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="fm-form-select"
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
            <div className="fm-select-arrow">▼</div>
          </div>

          <div className="fm-form-group">
            <select
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              className="fm-form-select"
              required
            >
              <option value="">Select Batch</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <option value="25">25</option>
              <option value="26">26</option>
            </select>
            <div className="fm-select-arrow">▼</div>
          </div>

          <div className="fm-form-group">
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="fm-form-select"
            >
              <option value="">Select Purpose</option>
              <option value="None">None</option>
              <option value="Chair">Chair</option>
              <option value="Rep">Rep</option>
            </select>
            <div className="fm-select-arrow">▼</div>
          </div>

          {formData.purpose === "Chair" && (
            <div className="fm-form-group">
              <input
                type="text"
                name="society_name"
                value={formData.society_name}
                onChange={handleChange}
                className="fm-form-input"
                placeholder=" "
                required
              />
              <label className="fm-form-label">Society Name</label>
              <div className="fm-form-line"></div>
            </div>
          )}

          <div className="fm-form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="fm-form-input"
              placeholder=" "
            />
            <label className="fm-form-label">Reset Password (optional)</label>
            <div className="fm-form-line"></div>
          </div>

          <div className="fm-form-button-container">
            <button type="submit" className="fm-form-button">
              <span>Update Student</span>
              <div className="fm-button-effect"></div>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateStudentForm;
