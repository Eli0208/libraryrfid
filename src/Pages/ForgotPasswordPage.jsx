import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // To programmatically navigate to /reset-password

  // Handle input changes
  const handleEmailChange = (e) => setEmail(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setMessage(response.data.message);
      setErrorMessage("");

      // If the email exists, navigate to /reset-password
      if (response.status === 200) {
        navigate("/reset-password");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong, please try again."
      );
      setMessage("");
      console.error("Forgot Password Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password__container">
      <h2 className="forgot-password__heading">Forgot Password</h2>
      {message && <p className="forgot-password__success-message">{message}</p>}
      {errorMessage && (
        <p className="forgot-password__error-message">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="forgot-password__input-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <button
          className="forgot-password__button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      <div className="forgot-password__back-link">
        <a href="/login">Back to Login</a>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
