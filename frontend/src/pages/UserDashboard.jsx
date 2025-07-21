import React, { useState } from 'react'
import {
  ChevronRightIcon,
  Users2Icon,
  CalendarIcon,
  BuildingIcon,
  ClockIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BookLectureEventForm from '../components/BookLectureEventForm'
import '../styles/UserDashboard.css'
export default function UserDashboard() {
  const navigate = useNavigate()
  const [selectedForm, setSelectedForm] = useState(null)
  const [showNotes, setShowNotes] = useState(false)
  const specialNotes = [
    'Lecture hall H-204 is under maintenance.',
    'Staff meeting scheduled for Thursday 10 AM.',
    'Update your profile information before next week.',
  ]
  const handleFormClick = (formName) => {
    setSelectedForm((prev) => (prev === formName ? null : formName))
  }
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="welcome-title">Welcome User</h1>
            <div className="header-buttons">
              <button
                className="action-button"
                onClick={() => navigate('/time-table')}
              >
                <ClockIcon className="button-icon" />
                View Time Schedule
              </button>
              <button
                className="action-button"
                onClick={() => navigate('/hall-list')}
              >
                <BuildingIcon className="button-icon" />
                View Hall List
              </button>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="main-content">
          <div className="content-section">
            {/* Special Notes Section */}
            <div className="notes-section">
              <button
                className="notes-toggle"
                onClick={() => setShowNotes((prev) => !prev)}
              >
                <span className="toggle-text">Special Notes</span>
                <ChevronRightIcon
                  className={`toggle-icon ${showNotes ? 'rotate' : ''}`}
                />
              </button>
              {showNotes && (
                <div className="notes-content">
                  {specialNotes.map((note, index) => (
                    <div className="note-item" key={index}>
                      <span className="note-marker"></span>
                      <span className="note-text">{note}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Action Section */}
            <div className="action-section">
              <h2 className="section-title">Quick Actions</h2>
              <div className="action-grid">
                <button
                  className={`action-card ${selectedForm === 'book' ? 'selected' : ''}`}
                  onClick={() => handleFormClick('book')}
                >
                  <CalendarIcon className="card-icon" />
                  <span>Book Lecture/Event</span>
                </button>
              </div>
            </div>
          </div>
          {/* Form Display Section */}
          {selectedForm === 'book' ? (
            <div className="form-container">
              <BookLectureEventForm />
            </div>
          ) : (
            <div className="empty-state">
              <Users2Icon className="empty-icon" />
              <p className="empty-title">Dashboard content will appear here</p>
              <p className="empty-subtitle">Select an action from the buttons above</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}