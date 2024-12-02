import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import of jwt-decode
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import LibrarianDashboard from "./Pages/LibrarianDashboard"; // Import the LibrarianDashboard
import AdminPanel from "./Pages/AdminPanel"; // Import AdminPanel
import ForgotPasswordPage from "./Pages/ForgotPasswordPage"; // Import ForgotPasswordPage
import ResetPasswordPage from "./Pages/ResetPasswordPage";

const App = () => {
  const token = localStorage.getItem("authToken");
  const [userRole, setUserRole] = useState(token ? jwtDecode(token)?.role : "");

  useEffect(() => {
    getUserRole();
  }, [token]);

  const getUserRole = () => {
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUserRole("");
      }
    }
  };

  return (
    <Router>
      <Routes>
        {/* Route to LoginPage and RegisterPage */}
        <Route
          path="/login"
          element={<LoginPage setUserRole={setUserRole} />}
        />
        <Route path="/register" element={<RegisterPage />} />

        {/* Route to ForgotPasswordPage */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Conditional route to LibrarianDashboard or AdminPanel based on role */}
        <Route
          path="/dashboard"
          element={
            userRole === "user" ? (
              <LibrarianDashboard setUserRole={setUserRole} />
            ) : userRole === "admin" ? (
              <AdminPanel setUserRole={setUserRole} />
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
              <LibrarianDashboard setUserRole={setUserRole} />
            ) : userRole === "admin" ? (
              <AdminPanel setUserRole={setUserRole} />
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
