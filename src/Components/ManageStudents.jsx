import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageStudents.css";
import ConfirmationModal from "./ConfirmationModal";
import EditModal from "./EditModal"; // Import the EditModal component
import { jwtDecode } from "jwt-decode"; // Import jwtDecode properly

// Axios instance for base URL configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Set the base URL for API requests
});

const ManageStudents = () => {
  const token = localStorage.getItem("authToken");
  const [decodedToken, setDecodedToken] = useState(null);
  const [students, setStudents] = useState([]); // Store the student data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility for deletion
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal visibility for editing
  const [studentToDelete, setStudentToDelete] = useState(null); // Student to delete
  const [studentToEdit, setStudentToEdit] = useState(null); // Student to edit

  // Decode the token only once and store it in state
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded); // Store decoded token in state
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]); // This effect runs only when the token changes

  // Fetch students from the API once the decodedToken is available
  useEffect(() => {
    const fetchStudents = async () => {
      if (!decodedToken) return; // Do nothing if the token is not decoded yet

      try {
        const response = await axiosInstance.get("/students/allstudents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Map idNo to decodedToken.userId if decodedToken is available
        const mappedStudents = response.data.students.map((student) => ({
          ...student,
          idNo: decodedToken.userId || student.idNo, // Ensure idNo is set to userId from token if available
        }));

        setStudents(mappedStudents); // Update the state with the modified student data
        setLoading(false);
      } catch (err) {
        setError("Failed to load students.");
        setLoading(false);
      }
    };

    fetchStudents();
  }, [decodedToken, token]); // This effect runs only when decodedToken or token changes

  // Handle editing a student
  const handleEdit = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      setStudentToEdit(student); // Ensure student has the correct data
      setIsEditModalOpen(true); // Open the edit modal
    } else {
      console.error("Student not found for editing");
    }
  };

  // Handle saving the edited student
  const handleSave = async (updatedStudent) => {
    // Ensure studentToEdit has a valid _id before proceeding
    if (!studentToEdit || !studentToEdit.id) {
      console.error("Student ID is missing. Cannot save the student.");
      return; // Prevent the save operation
    }

    try {
      const response = await axiosInstance.put(
        `/students/${studentToEdit.id}`,
        { ...updatedStudent, idNo: decodedToken?.userId }, // Ensure the idNo is sent in the update request
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentToEdit.id ? response.data.student : student
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
          (student) => student.id !== studentToDelete.studentId
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
              <tr key={student.id}>
                <td>{student.studentNumber || "N/A"}</td>
                <td>{student.name || "N/A"}</td>
                <td>{student.rfidTag || "N/A"}</td>
                <td>{student.status || "N/A"}</td>
                <td>{student.institute || "N/A"}</td>{" "}
                {/* Add the Institute field */}
                <td>
                  {console.log(student)}
                  <button onClick={() => handleEdit(student.id)}>Edit</button>
                  <button
                    onClick={() => handleDelete(student.id, student.name)}
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
