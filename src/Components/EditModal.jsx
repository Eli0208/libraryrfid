import React, { useState, useEffect } from "react";
import "./EditModal.css"; // Add your CSS file for styling

const EditModal = ({ isOpen, onClose, onSave, student }) => {
  const [name, setName] = useState(student?.name || "");
  const [studentNumber, setStudentNumber] = useState(
    student?.studentNumber || ""
  );
  const [rfidTag, setRfidTag] = useState(student?.rfidTag || "");
  const [status, setStatus] = useState(student?.status || "Active");
  const [institute, setInstitute] = useState(student?.institute || ""); // Add state for institute

  // Reset form when modal is closed or student data changes
  useEffect(() => {
    if (isOpen && student) {
      setName(student.name);
      setStudentNumber(student.studentNumber);
      setRfidTag(student.rfidTag);
      setStatus(student.status);
      setInstitute(student.institute || ""); // Reset institute field
    }
  }, [isOpen, student]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, studentNumber, rfidTag, status, institute }); // Include institute in the data passed to onSave
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Student</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Student Number</label>
            <input
              type="text"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
            />
          </div>
          <div>
            <label>RFID Tag</label>
            <input
              type="text"
              value={rfidTag}
              onChange={(e) => setRfidTag(e.target.value)}
            />
          </div>
          <div>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
          {/* Add institute field */}
          <div>
            <label>Institute</label>
            <input
              type="text"
              value={institute}
              onChange={(e) => setInstitute(e.target.value)}
            />
          </div>
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
