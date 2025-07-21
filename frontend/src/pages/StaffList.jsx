import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import "../styles/StaffList.css";

const StaffList = () => {
  const [staffType, setStaffType] = useState("academic");
  const [sortBy, setSortBy] = useState("name");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/staff?type=${staffType}`);
      const data = await res.json();

      // Apply initial sorting
      const sorted = [...data].sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "department") return a.department.localeCompare(b.department);
        if (sortBy === "id") return a.staff_id - b.staff_id;
        return 0;
      });

      setStaffData(sorted);
      setError(null);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to load staff data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [staffType, sortBy]);

  const handleSortChange = (field) => {
    setSortBy(field);
    setIsDropdownOpen(false);
  };

  return (
    <div className="staff-page-wrapper">
      <div className="staff-page-inner">
        <h1 className="staff-page-title">Staff Management</h1>
        <div className="staff-list-container">
          <div className="staff-list-card">
            <div className="staff-list-header">
              <h2 className="staff-list-title">Staff Members</h2>
              <div className="toggle-container">
                <button
                  className={`toggle-button ${staffType === "academic" ? "active" : ""}`}
                  onClick={() => setStaffType("academic")}
                >
                  Academic
                </button>
                <button
                  className={`toggle-button ${staffType === "non-academic" ? "active" : ""}`}
                  onClick={() => setStaffType("non-academic")}
                >
                  Non Academic
                </button>
              </div>
            </div>

            <div className="sort-container">
              <div className="sort-dropdown">
                <button
                  className="sort-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Sort By <ChevronDownIcon className="sort-icon" />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={() => handleSortChange("name")}>Name</div>
                    <div className="dropdown-item" onClick={() => handleSortChange("department")}>Department</div>
                    <div className="dropdown-item" onClick={() => handleSortChange("id")}>Index Number</div>
                  </div>
                )}
              </div>
            </div>

            <div className="staff-table-container">
              {loading ? (
                <p className="loading-message">Loading staff data...</p>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : (
                <table className="staff-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Email</th>
                      <th>Contact No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffData.map((staff, index) => (
                      <tr key={staff.staff_id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                        <td>{staff.staff_id}</td>
                        <td>{staff.name}</td>
                        <td>{staff.department}</td>
                        <td>{staff.email}</td>
                        <td>{staff.contact_no}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffList;
