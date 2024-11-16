import React from "react";
import "./EditUserModal.css";

const EditUserModal = ({ editData, setEditData, onSave, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit User</h3>
        <label>
          Name:
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={editData.email}
            onChange={(e) =>
              setEditData({ ...editData, email: e.target.value })
            }
          />
        </label>
        <label>
          Role:
          <select
            value={editData.role}
            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </label>
        <div className="modal-actions">
          <button onClick={onSave}>Save</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
