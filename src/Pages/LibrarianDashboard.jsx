import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RegisterStudent from "../Components/RegisterStudent"; // Import RegisterStudent component
import "./LibrarianDashboard.css";
import HistoryLibrarian from "../Components/HistoryLibrarian";
import LibrarianProfile from "../Components/LibrarianProfile";
import { jwtDecode } from "jwt-decode";
import TimeInsStudent from "../Components/TimeInsStudent";
import SignInChart from "../Components/SignInChart";

const LibrarianDashboard = ({ setUserRole }) => {
  const [todaySignins, setTodaySignins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const name = decodedToken.name;

  // Get current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const fetchTodaySignins = async () => {
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/students/time-ins",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const timeIns = response.data.timeIns;

        // Filter time-ins for today and count unique student numbers
        const studentsSignedInToday = new Set();
        timeIns.forEach((timeIn) => {
          const timeInDate = new Date(timeIn.date);
          if (timeInDate >= startOfDay && timeInDate <= endOfDay) {
            studentsSignedInToday.add(timeIn.studentNumber);
          }
        });

        setTodaySignins(studentsSignedInToday.size);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchTodaySignins();
  }, [token]);

  const logoutUser = async () => {
    setUserRole("");
    try {
      if (!userId || !name) {
        throw new Error("User ID and name are required for logout");
      }

      // Make the POST request to the /logout endpoint with userId and name
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {
          userId: userId,
          name: name,
        }, // Pass the JSON object with userId and name
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      // Handle success
      console.log("Logout successful:", response.data);

      // Clear token and user info from localStorage after successful logout
      localStorage.removeItem("authToken");
    } catch (error) {
      // Handle error
      console.error(
        "Error during logout:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleLogout = () => {
    setUserRole("");
    logoutUser();
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
                <>
                  <div className="signins-info">
                    <h2>Today's Sign-ins</h2>
                    <p className="signins-count">{todaySignins}</p>
                  </div>
                  <SignInChart />
                  <TimeInsStudent />
                </>
              )}
            </div>
          </section>
        );
      case "history":
        return <HistoryLibrarian />;
      case "register":
        return <RegisterStudent />; // Directly call RegisterStudent component
      case "profile":
        return <LibrarianProfile />;
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
