import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./AdminPanel.css";
import HistoryLibrarian from "../Components/HistoryLibrarian";
import ManageStudents from "../Components/ManageStudents";
import ManageUsers from "../Components/ManageUsers";
import LibrarianLogs from "../Components/LibrarianLogs";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Dummy HistoryLibrarian Component

const AdminPanel = ({ setUserRole }) => {
  const token = localStorage.getItem("authToken");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  console.log(decodedToken);
  const name = decodedToken.name;
  const navigate = useNavigate();
  const [view, setView] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    logoutUser();
    setUserRole("");
    navigate("/login"); // Redirect to the login page
  };
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
            <a onClick={() => setView("librarian")}>Librarian Logs</a>
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
          {view === "librarian" && <LibrarianLogs />}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
