import React, { useState, useEffect } from "react";
import axios from "axios";

function LibrarianLogs() {
  const [logs, setLogs] = useState([]); // State to store logs
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/all-logs",
          {}, // Empty body or any required body data if needed
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

  return (
    <div>
      <h1>Librarian Logs</h1>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Action</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <tr key={log.id}>
                <td>{index + 1}</td>
                <td>{log.idNo}</td>
                <td>{log.name}</td>
                <td>{log.action}</td>
                <td>
                  {new Date(log.date).toLocaleDateString()} {log.time}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No logs available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LibrarianLogs;
