import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RegisterStudent from "../Components/RegisterStudent"; // Import RegisterStudent component
import "./LibrarianDashboard.css";
import HistoryLibrarian from "../Components/HistoryLibrarian";

const LibrarianDashboard = () => {
  const [todaySignins, setTodaySignins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  // Get current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchTodaySignins = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://libraryrfid-backend.onrender.com/api/students/records/all-time-in",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        let studentsSignedInToday = new Set();

        response.data.records.forEach((student) => {
          student.rfidScans.forEach((scan) => {
            const scanDate = new Date(scan.timestamp);
            if (scanDate >= startOfDay && scanDate <= endOfDay) {
              studentsSignedInToday.add(student._id);
            }
          });
        });

        setTodaySignins(studentsSignedInToday.size);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchTodaySignins();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <section className="dashboard-content">
            <div className="signins-container">
              {loading ? (
                <div className="loading-container">
                  <p>Loading today's sign-ins...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p className="error">{error}</p>
                </div>
              ) : (
                <div className="signins-info">
                  <h2>Today's Sign-ins</h2>
                  <p className="signins-count">{todaySignins}</p>
                </div>
              )}
            </div>
          </section>
        );
      case "history":
        return <HistoryLibrarian />;
      case "register":
        return <RegisterStudent />; // Directly call RegisterStudent component
      case "profile":
        return <p>Profile content goes here.</p>;
      default:
        return <p>Welcome to the main dashboard!</p>;
    }
  };

  return (
    <div className="librarian-dashboard">
      <div className="sidebar">
        <h2 className="sidebar-title">Librarian Dashboard</h2>
        <hr className="sidebar-divider" />
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <button
              onClick={() => setActiveSection("dashboard")}
              className="sidebar-link"
            >
              Dashboard
            </button>
          </li>
          <li className="sidebar-item">
            <button
              onClick={() => setActiveSection("history")}
              className="sidebar-link"
            >
              History
            </button>
          </li>
          <li className="sidebar-item">
            <button
              onClick={() => setActiveSection("profile")}
              className="sidebar-link"
            >
              Profile
            </button>
          </li>
          <li className="sidebar-item">
            <button
              onClick={() => setActiveSection("register")}
              className="sidebar-link"
            >
              Register Student
            </button>
          </li>
          <li className="sidebar-item">
            <button onClick={handleLogout} className="sidebar-link">
              Logout
            </button>
          </li>
        </ul>
      </div>
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default LibrarianDashboard;
