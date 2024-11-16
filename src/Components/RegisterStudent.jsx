import React, { useState } from "react";
import axios from "axios"; // Import axios to make HTTP requests
import "./RegisterStudent.css"; // Import the CSS file for styling

const RegisterStudent = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    name: "", // full name of the student
    studentNumber: "", // student number
    institute: "", // student institute
    rfidTag: "", // RFID tag
    status: "Active", // default status as "Active"
  });

  // State for error messages
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State to handle loading during submission
  const [success, setSuccess] = useState(""); // State to show success message after submission

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors
    setSuccess(""); // Clear success message

    // Simple validation
    if (
      !formData.name ||
      !formData.studentNumber ||
      !formData.institute ||
      !formData.rfidTag
    ) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    // Log the data to make sure it's correct
    console.log("Form Data Sent:", formData);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token is missing in localStorage.");
        setLoading(false);
        return;
      }

      // Send POST request to backend
      const response = await axios.post(
        `https://libraryrfid-backend.onrender.com/api/students/register`, // Correct endpoint
        formData, // Form data should be passed as the second argument
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );

      // Check for success by examining the message field
      if (response.data.message === "Student registered successfully") {
        setSuccess("Student registered successfully!");
        setFormData({
          name: "",
          studentNumber: "",
          institute: "",
          rfidTag: "",
          status: "Active",
        });
      } else {
        setError("Failed to register student.");
      }
    } catch (err) {
      console.error(
        "Error occurred while registering the student:",
        err.response || err
      );
      setError("An error occurred while registering the student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-student-section">
      <h2>Register Student</h2>

      {/* Display success message */}
      {success && <div className="success">{success}</div>}

      {/* Error message */}
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="studentNumber">Student Number</label>
          <input
            type="text"
            id="studentNumber"
            name="studentNumber"
            value={formData.studentNumber}
            onChange={handleChange}
            placeholder="Enter student number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="institute">Institute</label>
          <input
            type="text"
            id="institute"
            name="institute"
            value={formData.institute}
            onChange={handleChange}
            placeholder="Enter institute"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rfidTag">RFID Tag</label>
          <input
            type="text"
            id="rfidTag"
            name="rfidTag"
            value={formData.rfidTag}
            onChange={handleChange}
            placeholder="Enter RFID tag"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterStudent;
