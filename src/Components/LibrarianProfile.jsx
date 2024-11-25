import React, { useState } from "react";
import "./LibrarianProfile.css";
import { jwtDecode } from "jwt-decode"; // Corrected import
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LibrarianProfile() {
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  if (!token) {
    console.error("Authentication token not found.");
    navigate("/login");
    return null;
  }

  // Decode the token
  let name, email, userId;
  try {
    const decodedToken = jwtDecode(token);
    name = decodedToken.name;
    email = decodedToken.email;
    userId = decodedToken.userId; // Adjust based on the token structure
  } catch (error) {
    console.error("Failed to decode token:", error);
    navigate("/login");
    return null;
  }

  const handleChangeUser = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {
          userId: userId,
          name: name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error(
        "Failed to log out:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="librarian-profile">
      <h1>Librarian Profile</h1>
      <div className="profile-info">
        <h3>
          <strong>Name:</strong> {name}
        </h3>
        <h3>
          <strong>Email:</strong> {email}
        </h3>
      </div>
      <button className="change-user-button" onClick={() => setShowModal(true)}>
        Change User
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-profile">
            <h2>Confirm Change</h2>
            <p>Are you sure you want to change the user?</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleChangeUser}>
                Yes
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LibrarianProfile;
