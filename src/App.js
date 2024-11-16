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

const App = () => {
  // Get the token from localStorage (or wherever it's stored)
  const token = localStorage.getItem("authToken");

  // Function to check if the user role in the token is "user"
  const isUser = () => {
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token
        return decoded.role === "user"; // Check if the role is "user"
      } catch (error) {
        console.error("Failed to decode token:", error);
        return false;
      }
    }
    return false;
  };

  return (
    <Router>
      <Routes>
        {/* Route to LoginPage and RegisterPage */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Conditional route to LibrarianDashboard or LoginPage based on token */}
        <Route
          path="/dashboard"
          element={isUser() ? <LibrarianDashboard /> : <Navigate to="/login" />}
        />

        {/* Default route */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
