import React, { useState, useEffect } from 'react'
import {
  TrashIcon,
  SearchIcon,
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import '../styles/HallList.css'
import loadingLogo from '../assets/logo.png' // your logo path here

export default function HallList() {
  const navigate = useNavigate()

  const [halls, setHalls] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [filteredHalls, setFilteredHalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [showLoader, setShowLoader] = useState(true)
  const [allowDelete, setAllowDelete] = useState(false)

  // Check if previous page is admin-dashboard (on mount)
  useEffect(() => {
    const referrer = document.referrer
    if (referrer.includes('/admin-dashboard')) {
      setAllowDelete(true)
    }
  }, [])

  // Fetch halls with enforced 1 second minimum loading time
  useEffect(() => {
    const fetchHalls = async () => {
      const start = Date.now()
      try {
        const response = await fetch('http://localhost:5000/api/halls')
        const data = await response.json()
        setHalls(data)
      } catch (err) {
        console.error("Fetch error:", err)
        setError("Failed to load hall data")
      } finally {
        const elapsed = Date.now() - start
        const remaining = 1000 - elapsed
        setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0)
      }
    }

    fetchHalls()
  }, [])

  // Fade out loader after loading finishes with 0.5s delay
  useEffect(() => {
    if (!loading) {
      setTimeout(() => setShowLoader(false), 500)
    }
  }, [loading])

  // Filter & sort halls
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

  const handleDelete = async (id) => {
    // No need to check allowDelete here because button won't show if false
    try {
      const res = await fetch(`http://localhost:5000/api/halls/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setHalls(prev => prev.filter(h => h.hall_id !== id))
        setConfirmDeleteId(null)
      }
    } catch (err) {
      console.error("❌ Delete failed:", err)
    }
  }

  return (
    <>
      {/* Loading overlay */}
      {showLoader && (
        <div className={`loading-overlay ${!loading ? 'fade-out' : ''}`}>
          <img src={loadingLogo} alt="Loading" className="loading-logo" />
          <p>Loading...</p>
        </div>
      )}

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
                            sortConfig.direction === 'ascending'
                              ? <ArrowUpIcon className="h-4 w-4" />
                              : <ArrowDownIcon className="h-4 w-4" />
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
                {error ? (
                  <p className="error-message">{error}</p>
                ) : (
                  <table className="halls-table">
                    <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Seats</th>
                      <th>Main Building</th>
                      <th>Tech Officer</th>
                      <th>Contact</th>
                      {allowDelete && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHalls.length > 0 ? (
                      filteredHalls.map((hall) => (
                        <tr key={hall.hall_id}>
                          <td>{hall.hall_id}</td>
                          <td>{hall.name}</td>
                          <td>{hall.no_of_seats}</td>
                          <td>{hall.main_building}</td>
                          <td>{hall.assigned_tech_officer}</td>
                          <td>{hall.contact_no || 'N/A'}</td>
                          {allowDelete && (
                            <td>
                              <button
                                className="delete-button"
                                onClick={() => setConfirmDeleteId(hall.hall_id)}
                              >
                                <TrashIcon size={16} />
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={allowDelete ? 7 : 6} className="empty-message">No halls found matching your search.</td>
                      </tr>
                    )}
                  </tbody>

                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {confirmDeleteId && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this hall?</p>
                <div className="modal-buttons">
                  <button onClick={() => handleDelete(confirmDeleteId)} className="confirm-btn">Yes, Delete</button>
                  <button onClick={() => setConfirmDeleteId(null)} className="cancel-btn">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
