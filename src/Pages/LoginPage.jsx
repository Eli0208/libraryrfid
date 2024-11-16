import React, { useState } from "react";
import "./LoginPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // Handle input changes
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://libraryrfid-backend.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      // Extract token and user data from response
      const { token, user } = response.data;
      console.log(user);

      // Store token and user information in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(user));

      // Redirect to the dashboard using navigate
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Invalid credentials, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page__container">
      <h2 className="login-page__heading">Login</h2>
      {errorMessage && (
        <p className="login-page__error-message">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="login-page__input-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="login-page__input-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button className="login-page__button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Register and Forgot Password Links */}
      <div className="login-page__links">
        <p className="login-page__register">
          Don't have an account?{" "}
          <a href="/register" className="login-page__register-link">
            Register here
          </a>
        </p>
        <p className="login-page__forgot-password">
          <a
            href="/forgot-password"
            className="login-page__forgot-password-link"
          >
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;