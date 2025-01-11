import React, { useState } from "react";
import axios from "axios";
import "./RegisterStudent.css";
import { jwtDecode } from "jwt-decode";

const RegisterStudent = () => {
  const token = localStorage.getItem("authToken");
  const decodedtoken = jwtDecode(token);
  console.log(decodedtoken);

  const [formData, setFormData] = useState({
    name: "",
    studentNumber: "",
    institute: "Institute 1", // Default selection for the dropdown
    rfidTag: "",
    idNo: decodedtoken.userId,
    status: "Active",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.name || !formData.studentNumber || !formData.rfidTag) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    console.log("Form Data Sent:", formData);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token is missing in localStorage.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/students/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Student registered successfully") {
        setSuccess("Student registered successfully!");
        setFormData({
          name: "",
          studentNumber: "",
          institute: "Institute 1",
          rfidTag: "",
          idNo: decodedtoken.userId,
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

      {success && <div className="success">{success}</div>}
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
          <select
            id="institute"
            name="institute"
            value={formData.institute}
            onChange={handleChange}
          >
            <option value="Institute 1">
              Institute of Business and Management
            </option>
            <option value="Institute 2">
              Institute of Computing Studies and Library Information Science
            </option>
            <option value="Institute 3">
              Institute of Education, Arts, and Sciences
            </option>
          </select>
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
