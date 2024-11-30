import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [logs, setLogs] = useState([]); // State to store logs
  const [todayLogins, setTodayLogins] = useState([]); // State to store today's logins
  const [todayLogouts, setTodayLogouts] = useState([]); // State to store today's logouts
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/all-logs",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );
        setLogs(response.data.logs); // Store the logs in state
      } catch (error) {
        console.error(
          "Error fetching logs:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchLogs();
  }, [token]);

  useEffect(() => {
    if (logs.length > 0) {
      const today = new Date().toLocaleDateString(); // Get today's date in local format

      // Filter today's logins
      const loginsToday = logs.filter((log) => {
        const logDate = new Date(log.date).toLocaleDateString();
        return log.action === "login" && logDate === today;
      });

      // Filter today's logouts
      const logoutsToday = logs.filter((log) => {
        const logDate = new Date(log.date).toLocaleDateString();
        return log.action === "logout" && logDate === today;
      });

      setTodayLogins(loginsToday);
      setTodayLogouts(logoutsToday);
    }
  }, [logs]);

  return (
    <div className="admin-dashboard">
      <h2>Today's Logins</h2>
      <p>Total Logins: {todayLogins.length}</p>
      <table className="log-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {todayLogins.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.name}</td>
              <td>{log.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Today's Logouts</h2>
      <p>Total Logouts: {todayLogouts.length}</p>
      <table className="log-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {todayLogouts.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.name}</td>
              <td>{log.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
