import React, { useState } from "react";
import "./LibrarianProfile.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function LibrarianProfile() {
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  // Decode the token
  const { name, email } = jwtDecode(token);

  const handleChangeUser = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
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
