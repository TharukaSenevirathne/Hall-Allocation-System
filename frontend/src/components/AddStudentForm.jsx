import React, { useState } from "react"
import axios from "axios"

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
  })

  const [regPrefix, setRegPrefix] = useState("") // dynamic prefix like EG/2022/

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "batch") {
      const year = 1998 + parseInt(value)
      setRegPrefix(`EG/${year}/`)
      setFormData(prev => ({ ...prev, batch: value, reg_no: "" })) // clear reg_no when batch changes
    } else if (name === "reg_no") {
      const last4 = value.replace(/\D/g, "").slice(0, 4) // restrict to 4 digits
      setFormData(prev => ({ ...prev, reg_no: regPrefix + last4 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:5000/api/students", {
        ...formData,
        user_type: "Student"
      })
      console.log("✅ Student added:", res.data)
      alert("Student added successfully")
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
      })
      setRegPrefix("")
    } catch (err) {
      console.error("❌ Failed to add student:", err)
      alert("Failed to add student")
    }
  }

  return (
    <div className="admin-form-card">
      <h2 className="admin-form-title">Add New Student</h2>
      <form onSubmit={handleSubmit}>

        {/* Name */}
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

        {/* Batch dropdown */}
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

 <div className="admin-form-group">
  <input
    type="text"
    name="reg_no"
    inputMode="numeric"
    onChange={(e) => {
      const inputDigits = e.target.value.replace(regPrefix, "").replace(/\D/g, "").slice(0, 4); // Only digits
      setFormData((prev) => ({
        ...prev,
        reg_no: regPrefix + inputDigits
      }));
    }}
    value={regPrefix + formData.reg_no.replace(regPrefix, "")}
    placeholder="Registration Number"
    className="admin-form-input"
    required
    disabled={!formData.batch}
  />
</div>


        {/* Email, Contact, Department, Lecturer */}
        {["email", "contact_no", "lecturer_in_charge"].map(field => (
          <div className="admin-form-group" key={field}>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              className="admin-form-input"
              required
            />
          </div>
        ))}

        {/* Department dropdown */}
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

        {/* Society Name if Chair */}
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

        {/* Password */}
        <div className="admin-form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Temporary Password"
            className="admin-form-input"
            required
          />
        </div>

        <div className="admin-form-button-container">
          <button type="submit" className="admin-confirm-button">Confirm</button>
        </div>
      </form>
    </div>
  )
}

export default AddStudentForm
