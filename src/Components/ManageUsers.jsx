import React, { useState, useEffect } from "react";
import axios from "axios";
import EditUserModal from "./EditUserModal";
import "./ManageUsers.css";

const ManageUsers = () => {
  const token = localStorage.getItem("authToken");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState(false); // Modal state
  const [currentUser, setCurrentUser] = useState(null); // Current user being edited
  const [editData, setEditData] = useState({ name: "", email: "", role: "" }); // Edit form data

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://libraryrfid-backend.onrender.com/api/auth/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data.users);
        setLoading(false);
      } catch (err) {
        setError("Failed to load users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(
        `https://libraryrfid-backend.onrender.com/api/auth/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user); // Set current user being edited
    setEditData({ name: user.name, email: user.email, role: user.role }); // Prefill form
    setEditModal(true); // Open modal
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `https://libraryrfid-backend.onrender.com/api/auth/users/${currentUser._id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the user in the state
      setUsers(
        users.map((user) =>
          user._id === currentUser._id ? { ...user, ...editData } : user
        )
      );
      setEditModal(false); // Close modal
    } catch (err) {
      setError("Failed to update user");
    }
  };

  return (
    <section id="manage-users">
      <h2>Manage Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit User Modal */}
      {editModal && (
        <EditUserModal
          editData={editData}
          setEditData={setEditData}
          onSave={handleSave}
          onCancel={() => setEditModal(false)}
        />
      )}
    </section>
  );
};

export default ManageUsers;
