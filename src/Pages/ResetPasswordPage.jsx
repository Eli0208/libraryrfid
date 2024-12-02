import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPasswordPage.css";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState(""); // Email input for identifying the user
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, newPassword }
      );
      setMessage(response.data.message);
      setErrorMessage("");
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong, please try again."
      );
      setMessage("");
      console.error("Reset Password Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password__container">
      <h2 className="reset-password__heading">Reset Password</h2>
      {message && <p className="reset-password__success-message">{message}</p>}
      {errorMessage && (
        <p className="reset-password__error-message">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="reset-password__input-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="reset-password__input-field">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={newPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="reset-password__input-field">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
        <button
          className="reset-password__button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
