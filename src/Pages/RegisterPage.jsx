import React, { useState } from "react";
import "./RegisterPage.css";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://libraryrfid-backend.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        }
      );
      // Handle successful registration (e.g., redirect to login)
      window.location.href = "/login"; // Redirect to login page after successful registration
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page__container">
      <h2 className="register-page__heading">Register</h2>
      {errorMessage && (
        <p className="register-page__error-message">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="register-page__input-field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div className="register-page__input-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="register-page__input-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="register-page__input-field">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
        <button
          className="register-page__button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* Redirect to login page if already have an account */}
      <div className="register-page__login-link">
        <p>
          Already have an account?{" "}
          <a href="/login" className="register-page__login-link-text">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
