import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentPage.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

const StudentPage = () => {
  const [latestTimeIn, setLatestTimeIn] = useState(null);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [currentDayEntries, setCurrentDayEntries] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTimeIns = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/students/time-ins"
        );
        const timeIns = response.data.timeIns;

        if (timeIns.length > 0) {
          // Get the start and end of the current day
          const today = new Date();
          const startOfDay = new Date(today.setHours(0, 0, 0, 0));
          const endOfDay = new Date(today.setHours(23, 59, 59, 999));

          // Filter entries for the current day
          const todayEntries = timeIns.filter((entry) => {
            const entryDate = new Date(entry.date);
            return entryDate >= startOfDay && entryDate <= endOfDay;
          });

          // Find the latest time-in entry (regardless of the day)
          const latest = timeIns.reduce((latest, current) => {
            const latestDateTime = new Date(`${latest.date}T${latest.time}`);
            const currentDateTime = new Date(`${current.date}T${current.time}`);
            return currentDateTime > latestDateTime ? current : latest;
          });

          setLatestTimeIn(latest);
          setCurrentDayEntries(todayEntries.length);
        }
      } catch (err) {
        console.error("Error fetching time-ins:", err);
        setError(err.message);
      }
    };

    fetchTimeIns();

    // Update current date and time every second
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="student-page-container">
      <div className="current-date-time">
        <p>{currentDateTime}</p>
      </div>
      {error && <p className="error-message">Error: {error}</p>}
      {latestTimeIn ? (
        <div className="time-in-details">
          <div className="time-in-row">
            <span className="time-in-label">Name:</span>
            <span className="time-in-value">{latestTimeIn.name}</span>
          </div>
          <div className="time-in-row">
            <span className="time-in-label">RFID Number:</span>
            <span className="time-in-value">{latestTimeIn.rfidTag}</span>
          </div>
          <div className="time-in-row">
            <span className="time-in-label">Institute:</span>
            <span className="time-in-value">{latestTimeIn.institute}</span>
          </div>
          <div className="time-in-row">
            <span className="time-in-label">Date:</span>
            <span className="time-in-value">
              {new Date(latestTimeIn.date).toLocaleDateString()}
            </span>
          </div>
          <div className="time-in-row">
            <span className="time-in-label">Time:</span>
            <span className="time-in-value">{latestTimeIn.time}</span>
          </div>
        </div>
      ) : (
        <p className="no-data-message">No time-in data available.</p>
      )}
      <div className="time-in-summary">
        <p>Number of entries today: {currentDayEntries}</p>
      </div>
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default StudentPage;
