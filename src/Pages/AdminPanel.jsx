import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./AdminPanel.css";
import HistoryLibrarian from "../Components/HistoryLibrarian";
import ManageStudents from "../Components/ManageStudents";
import ManageUsers from "../Components/ManageUsers";

// Dummy HistoryLibrarian Component

const AdminPanel = () => {
  const navigate = useNavigate(); // Initialize the navigation function
  const [view, setView] = useState("dashboard"); // Manage current view state

  const handleLogout = () => {
    // Perform any logout logic here, like clearing tokens or session storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="admin-panel">
      <nav className="admin-nav">
        <h2>Library Admin</h2>
        <ul>
          <li>
            <a href="#dashboard" onClick={() => setView("dashboard")}>
              Dashboard
            </a>
          </li>
          <li>
            <a href="#students" onClick={() => setView("students")}>
              Manage Students
            </a>
          </li>
          <li>
            <a href="#attendance" onClick={() => setView("attendanceLogs")}>
              Attendance Logs
            </a>
          </li>
          <li>
            <a onClick={() => setView("manageusers")}>Manage Users</a>
          </li>
          <li>
            <a href="#logout" onClick={handleLogout}>
              Logout
            </a>
          </li>
        </ul>
      </nav>

      <div className="admin-content">
        <header className="admin-header">
          <h1>Library Attendance System - Admin Module</h1>
        </header>

        <main className="admin-main">
          {/* Conditional Rendering Based on the View */}
          {view === "dashboard" && <section id="dashboard"></section>}

          {view === "students" && <ManageStudents />}

          {view === "attendanceLogs" && <HistoryLibrarian />}
          {view === "manageusers" && <ManageUsers />}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
