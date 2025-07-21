import React, { useState } from "react"

const AddStaffForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    regNumber: "",
    email: "",
    contactNumber: "",
    department: "IS",
    staffType: "Academic",
    teachingModules: "",
    password: ""
  })

   const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "teachingModules") {
      // Remove all commas first
      const raw = value.toUpperCase().replace(/,/g, "");
      let result = ""

      for (let i = 0; i < raw.length; i++) {
        if (i > 0 && i % 6 === 0) {
          result += ","
        }
        result += raw[i]
      }

      setFormData((prev) => ({
        ...prev,
        [name]: result
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:5000/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        alert("Staff added successfully!")
        setFormData({
          name: "",
          regNumber: "",
          email: "",
          contactNumber: "",
          department: "IS",
          staffType: "Academic",
          teachingModules: "",
          password: ""
        })
      } else {
        alert("Error: " + (data.error || "Failed to add staff"))
      }
    } catch (err) {
      console.error("Error adding staff:", err)
      alert("Something went wrong!")
    }
  }

  return (
    <div className="admin-form-card">
      <h2 className="admin-form-title">Add New Member</h2>
      <form onSubmit={handleSubmit}>
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
            name="regNumber"
            value={formData.regNumber}
            onChange={handleChange}
            placeholder="Reg. Number"
            className="admin-form-input"
            required
          />
        </div>

        <div className="admin-form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="admin-form-input"
            required
          />
        </div>

        <div className="admin-form-group">
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            className="admin-form-input"
            required
          />
        </div>

        {/* Department Dropdown */}
        <div className="admin-form-group">
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="admin-form-input"
            required
          >
            <option value="IS">IS</option>
            <option value="Computer">Computer</option>
            <option value="DEIE">DEIE</option>
            <option value="CEE">CEE</option>
            <option value="MME">MME</option>
            <option value="MENA">MENA</option>
          </select>
        </div>

        {/* Staff Type Dropdown */}
        <div className="admin-form-group">
          <select
            name="staffType"
            value={formData.staffType}
            onChange={handleChange}
            className="admin-form-input"
            required
          >
            <option value="Academic">Academic</option>
            <option value="Non-Academic">Non-Academic</option>
          </select>
        </div>

        {/* Teaching Modules */}
        {formData.staffType === "Academic" && (
          <div className="admin-form-group">
            <input
              type="text"
              name="teachingModules"
              value={formData.teachingModules}
              onChange={handleChange}
              placeholder="Teaching Modules (e.g., EE2344,IS2455)"
              className="admin-form-input"
            />
          </div>
        )}

        <div className="admin-form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Set Password"
            className="admin-form-input"
            required
          />
        </div>

        <div className="admin-form-button-container">
          <button type="submit" className="admin-confirm-button">
            Add Staff
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddStaffForm
