import React from "react";
import "./ConfirmationModal.css"; // Make sure to style your modal

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, studentName }) => {
  if (!isOpen) return null; // Don't render if the modal is closed

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Are you sure you want to delete {studentName}?</h3>
        <div className="modal-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
