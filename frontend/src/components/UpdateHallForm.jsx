import React, { useState } from "react"

const UpdateHallForm = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [formData, setFormData] = useState(null)
  const [selectedHallId, setSelectedHallId] = useState(null)

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/halls/search?query=${searchQuery}`)
      const data = await res.json()
      setSearchResults(data)
    } catch (err) {
      console.error("Search error:", err)
    }
  }

  const handleSelect = (hall) => {
    setSelectedHallId(hall.hall_id)
    setFormData({
      hallName: hall.name,
      mainBuilding: hall.main_building,
      seats: hall.no_of_seats,
      acAvailability: hall.ac_available ? "Yes" : "No",
      projectorAvailability: hall.no_of_projectors,
      nonAcademicMember: hall.assigned_tech_officer || ""
    })
    setSearchQuery("")
    setSearchResults([])
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:5000/api/halls/${selectedHallId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.hallName,
          main_building: formData.mainBuilding,
          no_of_seats: Number(formData.seats),
          ac_available: formData.acAvailability === "Yes",
          no_of_projectors: Number(formData.projectorAvailability),
          assigned_tech_officer: formData.nonAcademicMember
        })
      })

      const data = await res.json()
      if (res.ok) {
        alert("Hall updated successfully!")
        setFormData(null)
        setSelectedHallId(null)
      } else {
        alert("Error: " + (data.message || "Failed to update hall"))
      }
    } catch (err) {
      console.error("Update error:", err)
      alert("Something went wrong!")
    }
  }

  return (
    <div className="admin-form-card">
      <h2 className="admin-form-title">Update Hall</h2>

      <div className="admin-form-group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Hall Name"
          className="admin-form-input"
        />
        <button type="button" className="admin-confirm-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {searchResults.length > 0 && (
        <ul className="search-dropdown">
          {searchResults.map((hall) => (
            <li key={hall.hall_id} onClick={() => handleSelect(hall)}>
              {hall.name} ({hall.main_building})
            </li>
          ))}
        </ul>
      )}

      {formData && (
        <form onSubmit={handleUpdate}>
          <div className="admin-form-group">
            <input
              type="text"
              name="hallName"
              value={formData.hallName}
              onChange={handleChange}
              placeholder="Hall Name"
              className="admin-form-input"
              required
            />
          </div>

          <div className="admin-form-group">
            <select
              name="mainBuilding"
              value={formData.mainBuilding}
              onChange={handleChange}
              className="admin-form-input-select"
              required
            >
              <option value="">Select Main Building</option>
              <option value="Admin">Admin</option>
              <option value="Old Lecture Hall Building">New Lecture Hall Building</option>
              <option value="Old Lecture Hall Building">Old Lecture Hall Building</option>
              <option value="DEIE Building">DEIE Building</option>
              <option value="MME Building">MME Building</option>
              <option value="CEE Building">CEE Building</option>
            </select>
          </div>

          <div className="admin-form-group">
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              placeholder="Number of Seats"
              className="admin-form-input"
              required
            />
          </div>

          <div className="admin-form-group">
            <select
              name="acAvailability"
              value={formData.acAvailability}
              onChange={handleChange}
              className="admin-form-input-select"
              required
            >
              <option value="">AC Availability</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="admin-form-group">
            <input
              type="number"
              name="projectorAvailability"
              value={formData.projectorAvailability}
              onChange={handleChange}
              placeholder="Number of Projectors"
              className="admin-form-input"
              required
            />
          </div>

          <div className="admin-form-group">
            <input
              type="text"
              name="nonAcademicMember"
              value={formData.nonAcademicMember}
              onChange={handleChange}
              placeholder="Assigned Non-Academic Member"
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-button-container">
            <button type="submit" className="admin-form-button admin-confirm-button">
              Update Hall
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default UpdateHallForm
