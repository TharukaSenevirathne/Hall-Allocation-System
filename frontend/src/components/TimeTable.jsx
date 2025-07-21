import React, { useState, useEffect } from 'react';
import { DateNavigation } from './DateNavigation';
import { TimeTableContent } from './TimeTableContent';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './TimeTable.css';



export const TimeTable = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [halls, setHalls] = useState([]);
  const [moduleData, setModuleData] = useState({});
  const navigate = useNavigate();

  // Fetch halls
  useEffect(() => {
    axios.get("http://localhost:5000/api/halls")
      .then(res => {
        const hallNames = res.data.map(h => h.name.trim());
        console.log("✅ Fetched halls from backend:", hallNames);
        setHalls(hallNames);
      })
      .catch(err => {
        console.error("❌ Failed to fetch halls:", err);
      });
  }, []);

  // Fetch timetable for selected date
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const formattedDate = currentDate.toISOString().split("T")[0];
        console.log("🟡 [1] Requesting timetable for date:", formattedDate);

        const res = await axios.get(`http://localhost:5000/api/info?date=${formattedDate}`);
        const data = res.data;
        console.log("🟢 [2] Raw timetable response from backend:", data);

        const mapped = {};

        data.forEach(entry => {
          const hall = entry.hall_name.trim();
          const startTime = entry.start_time.substring(0, 5); // HH:mm
          const endTime = entry.end_time.substring(0, 5);     // HH:mm
          const label = entry.module_code || entry.event_name || "Reserved";

          let [sh, sm] = startTime.split(":").map(Number);
          let [eh, em] = endTime.split(":").map(Number);

          // Convert to total minutes
          let start = sh * 60 + sm;
          let end = eh * 60 + em;

          for (let mins = start; mins < end; mins += 30) {
            const hour = Math.floor(mins / 60);
            const minute = mins % 60;
            const slot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const key = `${hall}-${slot}`;
            mapped[key] = label;
          }
        });

        console.log("🔵 [3] Final mapped moduleData:", mapped);
        setModuleData(mapped);
      } catch (err) {
        console.error("❌ Failed to fetch timetable:", err);
      }
    };

    fetchTimetable();
  }, [currentDate]);

  // Prevent scroll
  useEffect(() => {
    document.body.classList.add('no-scroll-page');
    return () => {
      document.body.classList.remove('no-scroll-page');
    };
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 21;
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === endHour && minute === 30) continue;
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({ time, formattedTime: formatTimeSlot(hour, minute) });
      }
    }
    return slots;
  };

  const formatTimeSlot = (hour, minute) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <h1 className="timetable-title">Timetable</h1>
        <button className="home-button" onClick={() => navigate(-1)}>Back</button>

      </div>
      <DateNavigation 
        currentDate={currentDate} 
        onDateChange={setCurrentDate} 
      />
      <div className="timetable-wrapper">
        {halls.length === 0 ? (
          <p>Loading halls...</p>
        ) : (
          <TimeTableContent 
            timeSlots={timeSlots} 
            halls={halls} 
            moduleData={moduleData}
          />
        )}
      </div>
    </div>
  );
};
