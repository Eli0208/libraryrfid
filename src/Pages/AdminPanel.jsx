import React, { useState } from "react";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [selectedDate, setSelectedDate] = useState("2024-10-16");
  const [filteredAttendance, setFilteredAttendance] = useState([
    {
      date: "2024-10-15",
      name: "Gatotkaca",
      timeIn: "10:00 AM",
      timeOut: "01:00 PM",
    },
    {
      date: "2024-10-15",
      name: "Bumblebee",
      timeIn: "11:30 AM",
      timeOut: "02:00 PM",
    },
  ]);

  const attendanceData = {
    "2024-10-16": [
      { name: "Lydon Mandap", timeIn: "09:00 AM", timeOut: "12:00 PM" },
      { name: "Alice Johnson", timeIn: "10:00 AM", timeOut: "12:30 PM" },
    ],
    "2024-10-15": [
      { name: "Gatotkaca", timeIn: "10:00 AM", timeOut: "01:00 PM" },
      { name: "Bumblebee", timeIn: "11:30 AM", timeOut: "02:00 PM" },
    ],
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setFilteredAttendance(attendanceData[date] || []);
  };

  return (
    <div className="admin-panel">
      <nav className="admin-nav">
        <h2>Library Admin</h2>
        <ul>
          <li>
            <a href="#dashboard">Dashboard</a>
          </li>
          <li>
            <a href="#students">Manage Students</a>
          </li>
          <li>
            <a href="#attendance">Attendance Logs</a>
          </li>
          <li>
            <a href="#logout">Logout</a>
          </li>
        </ul>
      </nav>

      <div className="admin-content">
        <header className="admin-header">
          <h1>Library Attendance System - Admin Module</h1>
        </header>

        <main className="admin-main">
          <section id="dashboard">
            <h2>Admin Dashboard</h2>
            <div className="card">
              <h3>Total Students</h3>
              <p>120</p>
            </div>
            <div className="card">
              <h3>Today's Attendance</h3>
              <p>85</p>
            </div>
          </section>

          <section id="students">
            <h2>Manage Students</h2>
            <table className="student-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>RFID Tag</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Lydon Mandap</td>
                  <td>1234567890</td>
                  <td>Active</td>
                  <td>
                    <button>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="attendance">
            <h2>Attendance Logs</h2>
            <h3>Filter Attendance by Date</h3>
            <label htmlFor="date-select">Select Date:</label>
            <select
              id="date-select"
              value={selectedDate}
              onChange={handleDateChange}
            >
              <option value="2024-10-16">2024-10-16</option>
              <option value="2024-10-15">2024-10-15</option>
              <option value="2024-10-14">2024-10-14</option>
            </select>

            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student Name</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record, index) => (
                  <tr key={index}>
                    <td>{selectedDate}</td>
                    <td>{record.name}</td>
                    <td>{record.timeIn}</td>
                    <td>{record.timeOut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
