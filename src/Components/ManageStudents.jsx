import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageStudents.css";
import ConfirmationModal from "./ConfirmationModal";
import EditModal from "./EditModal"; // Import the EditModal component

// Axios instance for base URL configuration
const axiosInstance = axios.create({
  baseURL: "https://libraryrfid-backend.onrender.com/api", // Set the base URL for API requests
});

const ManageStudents = () => {
  const token = localStorage.getItem("authToken");
  const [students, setStudents] = useState([]); // Store the student data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility for deletion
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal visibility for editing
  const [studentToDelete, setStudentToDelete] = useState(null); // Student to delete
  const [studentToEdit, setStudentToEdit] = useState(null); // Student to edit

  // Fetch students from the API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get(
          "/students/records/allstudents",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudents(response.data.students); // Assuming the API returns the array directly
        setLoading(false);
      } catch (err) {
        setError("Failed to load students");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle editing a student
  const handleEdit = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    setStudentToEdit(student);
    setIsEditModalOpen(true); // Open the edit modal
  };

  // Handle saving the edited student
  const handleSave = async (updatedStudent) => {
    try {
      const response = await axiosInstance.put(
        `/students/${studentToEdit._id}`,
        updatedStudent,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === studentToEdit._id ? response.data.student : student
        )
      );
      setIsEditModalOpen(false); // Close the edit modal after saving
    } catch (err) {
      console.error("Failed to update student:", err);
    }
  };

  // Handle deleting a student
  const handleDelete = (studentId, studentName) => {
    setStudentToDelete({ studentId, studentName });
    setIsModalOpen(true); // Open the confirmation modal for deletion
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/students/${studentToDelete.studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Remove the student from the list after deletion
      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) => student._id !== studentToDelete.studentId
        )
      );
      setIsModalOpen(false); // Close the modal after successful deletion
    } catch (err) {
      console.error("Failed to delete student:", err);
      setIsModalOpen(false); // Close the modal even if it fails
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setIsModalOpen(false); // Close the modal without deleting
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditModalOpen(false); // Close the edit modal without saving
  };

  return (
    <section id="students">
      <h2>Manage Students</h2>
      {loading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>RFID Tag</th>
              <th>Status</th>
              <th>Institute</th> {/* Add the Institute column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.studentNumber || "N/A"}</td>
                <td>{student.name || "N/A"}</td>
                <td>{student.rfidTag || "N/A"}</td>
                <td>{student.status || "N/A"}</td>
                <td>{student.institute || "N/A"}</td>{" "}
                {/* Add the Institute field */}
                <td>
                  <button onClick={() => handleEdit(student._id)}>Edit</button>
                  <button
                    onClick={() => handleDelete(student._id, student.name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirmation Modal for Deletion */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        studentName={studentToDelete?.studentName}
      />

      {/* Edit Modal for Editing Student */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        onSave={handleSave}
        student={studentToEdit}
      />
    </section>
  );
};

export default ManageStudents;
