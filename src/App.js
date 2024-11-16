import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import LibrarianDashboard from "./Pages/LibrarianDashboard"; // Import the LibrarianDashboard
import AdminPanel from "./Pages/AdminPanel"; // Import AdminPanel

const App = () => {
  // Get the token from localStorage (or wherever it's stored)
  const token = localStorage.getItem("authToken");

  // Function to decode the token and return the user's role
  const getUserRole = () => {
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token
        return decoded.role; // Return the role
      } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
      }
    }
    return null;
  };

  const userRole = getUserRole();

  return (
    <Router>
      <Routes>
        {/* Route to LoginPage and RegisterPage */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Conditional route to LibrarianDashboard or AdminPanel based on role */}
        <Route
          path="/dashboard"
          element={
            userRole === "user" ? (
              <LibrarianDashboard />
            ) : userRole === "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Default route */}
        <Route
          path="/"
          element={
            userRole === "user" ? (
              <LibrarianDashboard />
            ) : userRole === "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
