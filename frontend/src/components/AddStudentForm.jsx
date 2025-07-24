import React, { useState, useEffect } from "react";

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    reg_no: "",
    email: "",
    contact_no: "",
    department: "",
    batch: "",
    purpose: "",
    society_name: "",
    lecturer_in_charge: "",
    password: ""
  });

  const [regPrefix, setRegPrefix] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "batch") {
      const year = 1998 + parseInt(value);
      setRegPrefix(`EG/${year}/`);
      setFormData(prev => ({ ...prev, batch: value, reg_no: "" }));
    } else if (name === "reg_no") {
      const last4 = value.replace(/\D/g, "").slice(0, 4);
      setFormData(prev => ({ ...prev, reg_no: regPrefix + last4 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_type: "Student"
        })
      });

      if (response.ok) {
        setMessage("✅ Student added successfully");
        setMessageType("success");
        setFormData({
          name: "",
          reg_no: "",
          email: "",
          contact_no: "",
          department: "",
          batch: "",
          purpose: "",
          society_name: "",
          lecturer_in_charge: "",
          password: ""
        });
        setRegPrefix("");
      } else {
        const data = await response.json();
        setMessage("❌ Failed to add student: " + (data.error || "Unknown error"));
        setMessageType("error");
      }
    } catch (err) {
      console.error("❌ Failed to add student:", err);
      setMessage("❌ Failed to add student");
      setMessageType("error");
    }
  };

  return (
    <div className="fm-form-card">
      <div className="fm-form-header">
        <h2 className="fm-form-title">Add New Student</h2>
        <div className="fm-form-icon">👨‍🎓</div>
      </div>

      {message && (
        <div className={`fm-message ${messageType === "success" ? "fm-message-success" : "fm-message-error"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="fm-form-group">
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="fm-form-input" placeholder=" " required />
          <label className="fm-form-label">Name</label>
          <div className="fm-form-line"></div>
        </div>

        <div className="fm-form-group">
          <select name="batch" value={formData.batch} onChange={handleChange} className="fm-form-select" required>
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
          <input
            type="text"
            name="reg_no"
            inputMode="numeric"
            onChange={(e) => {
              const inputDigits = e.target.value.replace(regPrefix, "").replace(/\D/g, "").slice(0, 4);
              setFormData((prev) => ({
                ...prev,
                reg_no: regPrefix + inputDigits
              }));
            }}
            value={formData.reg_no}
            className="fm-form-input"
            placeholder=" "
            required
            disabled={!formData.batch}
          />
          <label className="fm-form-label">Registration Number</label>
          <div className="fm-form-line"></div>
          {regPrefix && <div className="fm-reg-prefix-indicator">{regPrefix}</div>}
        </div>

        <div className="fm-form-group">
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="fm-form-input" placeholder=" " required />
          <label className="fm-form-label">Email</label>
          <div className="fm-form-line"></div>
        </div>

        <div className="fm-form-group">
          <input type="text" name="contact_no" value={formData.contact_no} onChange={handleChange} className="fm-form-input" placeholder=" " required />
          <label className="fm-form-label">Contact Number</label>
          <div className="fm-form-line"></div>
        </div>

        <div className="fm-form-group">
          <input type="text" name="lecturer_in_charge" value={formData.lecturer_in_charge} onChange={handleChange} className="fm-form-input" placeholder=" " required />
          <label className="fm-form-label">Lecturer in Charge</label>
          <div className="fm-form-line"></div>
        </div>

        <div className="fm-form-group">
          <select name="department" value={formData.department} onChange={handleChange} className="fm-form-select" required>
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
          <select name="purpose" value={formData.purpose} onChange={handleChange} className="fm-form-select">
            <option value="">Select Purpose</option>
            <option value="None">None</option>
            <option value="Chair">Chair</option>
            <option value="Rep">Rep</option>
          </select>
          <div className="fm-select-arrow">▼</div>
        </div>

        {formData.purpose === "Chair" && (
          <div className="fm-form-group">
            <input type="text" name="society_name" value={formData.society_name} onChange={handleChange} className="fm-form-input" placeholder=" " required />
            <label className="fm-form-label">Society Name</label>
            <div className="fm-form-line"></div>
          </div>
        )}

        <div className="fm-form-group">
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="fm-form-input" placeholder=" " required />
          <label className="fm-form-label">Temporary Password</label>
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

export default AddStudentForm;
