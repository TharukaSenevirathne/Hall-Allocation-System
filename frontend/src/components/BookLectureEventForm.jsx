import React, { useState, useEffect } from "react"
import axios from "axios"

const BookLectureEventForm = () => {
  const [step, setStep] = useState(1)
  const [bookingType, setBookingType] = useState("Lecture")
  const [formData, setFormData] = useState({
    moduleCode: "",
    eventName: "",
    targetBatch: "",
    department: "",
    date: "",
    startTime: "",
    endTime: "",
    hallName: ""
  })
  const [hallOptions, setHallOptions] = useState([])

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/halls")
        const hallNames = res.data.map(h => h.name)
        setHallOptions(hallNames)
      } catch (err) {
        console.error("❌ Failed to fetch halls:", err)
        alert("Error fetching hall data")
      }
    }
    fetchHalls()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const roundTimeTo30Min = (timeStr) => {
    if (!timeStr) return timeStr
    let [hour, minute] = timeStr.split(":").map(Number)
    minute = minute >= 30 ? 30 : 0
    const hh = hour.toString().padStart(2, "0")
    const mm = minute.toString().padStart(2, "0")
    return `${hh}:${mm}`
  }

  const isValid30MinTime = (timeStr) => {
    if (!timeStr) return false
    const [_, m] = timeStr.split(":").map(Number)
    return m === 0 || m === 30
  }

  const checkAvailability = async (e) => {
    e.preventDefault()

    if (!isValid30MinTime(formData.startTime) || !isValid30MinTime(formData.endTime)) {
      alert("Please use 30-minute intervals only (e.g., 08:00, 08:30)")
      return
    }

    const [sh, sm] = formData.startTime.split(":").map(Number)
    const [eh, em] = formData.endTime.split(":").map(Number)

    let startMinutes = sh * 60 + sm
    let endMinutes = eh * 60 + em

    if (endMinutes <= startMinutes) {
      endMinutes += 12 * 60
      const newHour = Math.floor(endMinutes / 60) % 24
      const newMin = endMinutes % 60
      const fixedEnd = `${String(newHour).padStart(2, "0")}:${String(newMin).padStart(2, "0")}`

      setFormData(prev => ({ ...prev, endTime: fixedEnd }))
      alert(`⚠️ End time was earlier than or same as start. Adjusted to ${fixedEnd}`)
    }

    try {
      const res = await axios.post("http://localhost:5000/api/check-availability", {
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        hallName: formData.hallName
      })

      if (res.data.available) {
        alert("✅ Hall is available!")
        setStep(2)
      } else {
        alert("❌ Hall is not available at that time.")
        console.table(res.data.clashes)
      }
    } catch (err) {
      console.error("Error checking availability:", err)
      alert("Failed to check availability")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post("http://localhost:5000/api/bookings", {
        bookingType,
        ...formData
      })
      alert("✅ Booking successful")
      setFormData({
        moduleCode: "",
        eventName: "",
        targetBatch: "",
        department: "",
        date: "",
        startTime: "",
        endTime: "",
        hallName: ""
      })
      setStep(1)
    } catch (err) {
      console.error("❌ Booking failed:", err)
      alert("Failed to book event/lecture")
    }
  }

  return (
    <div className="admin-form-card">
      <h2 className="admin-form-title">Book Lecture / Event</h2>

      <form onSubmit={step === 1 ? checkAvailability : handleSubmit}>
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="admin-form-group">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="admin-form-input"
                required
              />
            </div>

            <div className="admin-form-group">
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                onBlur={(e) =>
                  setFormData(prev => ({ ...prev, startTime: roundTimeTo30Min(e.target.value) }))
                }
                className="admin-form-input"
                step="1800"
                required
              />
            </div>

            <div className="admin-form-group">
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                onBlur={(e) =>
                  setFormData(prev => ({ ...prev, endTime: roundTimeTo30Min(e.target.value) }))
                }
                className="admin-form-input"
                step="1800"
                required
              />
            </div>

            <div className="admin-form-group">
              <select
                name="hallName"
                value={formData.hallName}
                onChange={handleChange}
                className="admin-form-input"
                required
              >
                <option value="">Select Hall</option>
                {hallOptions.map(hall => (
                  <option key={hall} value={hall}>
                    {hall}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-button-container">
              <button type="submit" className="admin-confirm-button">
                Check Availability
              </button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="admin-form-summary">
              <p><strong>Selected Date:</strong> {formData.date}</p>
              <p><strong>Time:</strong> {formData.startTime} – {formData.endTime}</p>
              <p><strong>Hall:</strong> {formData.hallName}</p>
            </div>

            <div className="admin-form-group">
              <select
                name="bookingType"
                value={bookingType}
                onChange={(e) => {
                  setBookingType(e.target.value)
                  setFormData(prev => ({
                    ...prev,
                    moduleCode: "",
                    eventName: "",
                    targetBatch: "",
                    department: ""
                  }))
                }}
                className="admin-form-input"
                required
              >
                <option value="Lecture">Lecture</option>
                <option value="Event">Event</option>
              </select>
            </div>

            {bookingType === "Lecture" ? (
              <div className="admin-form-group">
                <input
                  type="text"
                  name="moduleCode"
                  value={formData.moduleCode}
                  onChange={handleChange}
                  placeholder="Module Code"
                  className="admin-form-input"
                  required
                />
              </div>
            ) : (
              <>
                <div className="admin-form-group">
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Event Name"
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <select
                    name="targetBatch"
                    value={formData.targetBatch}
                    onChange={handleChange}
                    className="admin-form-input"
                    required
                  >
                    <option value="">Target Batch</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="All">All</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="admin-form-input"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Computer">Computer</option>
                    <option value="EIE">EIE</option>
                    <option value="CEE">CEE</option>
                    <option value="MENA">MENA</option>
                    <option value="MME">MME</option>
                    <option value="Common">Common</option>
                  </select>
                </div>
              </>
            )}

            <div className="admin-form-button-container">
              <button
                type="button"
                className="admin-back-button"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button type="submit" className="admin-confirm-button">
                Confirm Booking
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}

export default BookLectureEventForm
