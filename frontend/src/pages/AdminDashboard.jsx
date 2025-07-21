import React, { useState } from 'react'
import {
  PlusCircleIcon,
  EditIcon,
  ClipboardEditIcon,
  ChevronRightIcon,
  Users2Icon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import AddHallForm from '../components/AddHallForm'
import AddStaffForm from '../components/AddStaffForm'
import AddStudentForm from '../components/AddStudentForm'
import UpdateStaffForm from '../components/UpdateStaffForm'
import UpdateStudentForm from '../components/UpdateStudentForm'
import UpdateHallForm from '../components/UpdateHallForm'
import BookLectureEventForm from '../components/BookLectureEventForm'

import '../styles/AdminDashboard.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('add') // 'add' or 'update'
  const [selectedForm, setSelectedForm] = useState(null)
  const [showNotes, setShowNotes] = useState(false)

  const specialNotes = [
    "Lecture hall H-204 is under maintenance.",
    "Staff meeting scheduled for Thursday 10 AM.",
    "Update your profile information before next week.",
  ]

  const handleModeToggle = (selectedMode) => {
    setMode(selectedMode)
    setSelectedForm(null) // Reset selected form when changing mode
  }

  const handleFormClick = (formName) => {
    setSelectedForm(prev => (prev === formName ? null : formName))
  }

  const renderFormComponent = () => {
    switch (selectedForm) {
      case 'hall':
        return mode === 'update' ? <UpdateHallForm /> : <AddHallForm mode={mode} />
      case 'staff':
        return mode === 'update' ? <UpdateStaffForm /> : <AddStaffForm mode={mode} />
      case 'student':
        return mode === 'update' ? <UpdateStudentForm /> : <AddStudentForm mode={mode} />
      case 'book':
        return <BookLectureEventForm />
      default:
        return (
          <div className="admin-content-placeholder">
            <div className="admin-placeholder-content">
              <Users2Icon className="admin-placeholder-icon" />
              <p className="admin-placeholder-text">Dashboard content will appear here</p>
              <p className="admin-placeholder-subtext">Select an action from the buttons above</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-panel">
        {/* Header Section */}
        <header className="admin-header">
          <h1 className="admin-title">Welcome Admin</h1>
          <div className="admin-nav-buttons">
            <button className="admin-nav-button" onClick={() => navigate('/time-table')}>View Time Schedule</button>
            <button className="admin-nav-button" onClick={() => navigate('/hall-list')}>View Hall List</button>
            <button className="admin-nav-button" onClick={() => navigate('/staff-list')}>View Staff List</button>
          </div>
        </header>

        {/* Main Content */}
        <main className="admin-main">
          <div className="admin-main-content">
            {/* Left Section */}
            <div className="admin-special-notes-section">
              <button
                className="admin-special-notes-button"
                onClick={() => setShowNotes(prev => !prev)}
              >
                <span>Special Notes</span>
                <ChevronRightIcon className={`admin-chevron-icon ${showNotes ? 'rotate' : ''}`} />
              </button>

              {showNotes && (
                <div className="admin-notice-board">
                  {specialNotes.map((note, index) => (
                    <div className="admin-notice-item" key={index}>
                      <span className="admin-red-dot" />
                      <span className="admin-notice-text">{note}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="admin-action-section">
              <div className="admin-action-buttons">
                <button
                  className={`admin-toggle-button ${mode === 'add' ? 'selected' : 'unselected'}`}
                  onClick={() => handleModeToggle('add')}
                >
                  <PlusCircleIcon className="admin-button-icon" />
                  <span>Add New</span>
                </button>
                <button
                  className={`admin-toggle-button ${mode === 'update' ? 'selected' : 'unselected'}`}
                  onClick={() => handleModeToggle('update')}
                >
                  <ClipboardEditIcon className="admin-button-icon" />
                  <span>Update</span>
                </button>
              </div>

              <div className="admin-edit-buttons">
                <button
                  className={`admin-edit-button ${selectedForm === 'staff' ? 'active' : ''}`}
                  onClick={() => handleFormClick('staff')}
                >
                  {mode === 'add' ? <PlusCircleIcon className="admin-button-icon" /> : <EditIcon className="admin-button-icon" />}
                  <span>Staff</span>
                </button>
                <button
                  className={`admin-edit-button ${selectedForm === 'student' ? 'active' : ''}`}
                  onClick={() => handleFormClick('student')}
                >
                  {mode === 'add' ? <PlusCircleIcon className="admin-button-icon" /> : <EditIcon className="admin-button-icon" />}
                  <span>Student</span>
                </button>
                <button
                  className={`admin-edit-button ${selectedForm === 'hall' ? 'active' : ''}`}
                  onClick={() => handleFormClick('hall')}
                >
                  {mode === 'add' ? <PlusCircleIcon className="admin-button-icon" /> : <EditIcon className="admin-button-icon" />}
                  <span>Hall</span>
                </button>
                <button
                  className={`admin-edit-button ${selectedForm === 'book' ? 'active' : ''}`}
                  onClick={() => handleFormClick('book')}
                >
                  <PlusCircleIcon className="admin-button-icon" />
                  <span>Lecture/Event</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Display Section */}
          {selectedForm && (
            <div className="admin-form-wrapper">
              {renderFormComponent()}
            </div>
          )}

          {/* Placeholder only if no form is selected */}
          {!selectedForm && (
            <div className="admin-dashboard-content">
              <div className="admin-content-placeholder">
                <div className="admin-placeholder-content">
                  <Users2Icon className="admin-placeholder-icon" />
                  <p className="admin-placeholder-text">Dashboard content will appear here</p>
                  <p className="admin-placeholder-subtext">Select an action from the buttons above</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
