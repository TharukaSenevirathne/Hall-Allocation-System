import React, { useState } from "react";

const UpdateStaffForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/staff/search?query=${searchQuery}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleSelect = async (staff) => {
    setSelectedStaffId(staff.staff_id); // ✅ FIXED: use staff_id
    setFormData({
      name: staff.name,
      regNumber: staff.reg_number,
      email: staff.email,
      contactNumber: staff.contact_number,
      department: staff.department,
      staffType: staff.staff_type,
      teachingModules: staff.teaching_modules || "",
      password: "" // For security, not fetched. Admin can reset it if needed.
    });
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "teachingModules") {
      const raw = value.toUpperCase().replace(/,/g, "");
      let result = "";
      for (let i = 0; i < raw.length; i++) {
        if (i > 0 && i % 6 === 0) {
          result += ",";
        }
        result += raw[i];
      }
      setFormData((prev) => ({ ...prev, [name]: result }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/staff/${selectedStaffId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Staff updated successfully!");
        setFormData(null);
        setSelectedStaffId(null);
      } else {
        alert("Error: " + (data.error || "Failed to update"));
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="admin-form-card">
      <h2 className="admin-form-title">Update Staff Member</h2>

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

      {/* Display Search Results */}
      {searchResults.length > 0 && (
        <ul className="search-dropdown">
          {searchResults.map((staff) => (
            <li key={staff.staff_id} onClick={() => handleSelect(staff)}>
              {staff.name} ({staff.reg_number})
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
              placeholder="Reset Password (optional)"
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-button-container">
            <button type="submit" className="admin-confirm-button">
              Update Staff
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateStaffForm;
