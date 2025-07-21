import React, { useEffect, useState } from 'react'
import {
  SearchIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import '../styles/HallList.css'

export default function HallList() {
  const navigate = useNavigate()

  const [halls, setHalls] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [filteredHalls, setFilteredHalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data from the backend
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/halls') // Adjust if your backend URL/port is different
        const data = await response.json()
        setHalls(data)
      } catch (err) {
        console.error("Fetch error:", err)
        setError("Failed to load hall data")
      } finally {
        setLoading(false)
      }
    }

    fetchHalls()
  }, [])

  // Filtering & Sorting logic
  useEffect(() => {
    let filtered = halls.filter(hall =>
      hall.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1
        return 0
      })
    }

    setFilteredHalls(filtered)
  }, [halls, searchTerm, sortConfig])

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  return (
    <div className="admin-container">
      <div className="admin-panel">
        <div className="admin-header">
          <h1 className="admin-title">Hall List</h1>
          <div className="nav-buttons">
            <button className="nav-button" onClick={() => navigate(-1)}>Dashboard</button>
          </div>
        </div>

        <div className="admin-main">
          <div className="main-content">
            <div className="main-toolbar">
              <div className="sort-dropdown">
                <button className="sort-button" onClick={() => setSortMenuOpen(!sortMenuOpen)}>
                  Sort By
                  <ChevronDownIcon className={`h-5 w-5 ${sortMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {sortMenuOpen && (
                  <div className="sort-menu">
                    {['hall_id', 'name', 'no_of_seats', 'main_building'].map((key) => (
                      <button key={key} onClick={() => { requestSort(key); setSortMenuOpen(false) }}>
                        {key === 'hall_id' && 'Index'}
                        {key === 'name' && 'Name'}
                        {key === 'no_of_seats' && 'No. of Seats'}
                        {key === 'main_building' && 'Main Building'}
                        {sortConfig.key === key && (
                          sortConfig.direction === 'ascending' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <SearchIcon className="search-icon" />
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <p className="loading-message">Loading halls...</p>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : (
                <table className="halls-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Seats</th>
                      <th>Main Building</th>
                      <th>Technical Officer</th>
                      <th>Contact No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHalls.length > 0 ? (
                      filteredHalls.map((hall) => (
                        <tr
                          key={hall.hall_id}
                          onClick={() => navigate(`/hall/${hall.hall_id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{hall.hall_id}</td>
                          <td>{hall.name}</td>
                          <td>{hall.no_of_seats}</td>
                          <td>{hall.main_building}</td>
                          <td>{hall.assigned_tech_officer}</td>
                          <td>{hall.contact_no || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="empty-message">
                          No halls found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
