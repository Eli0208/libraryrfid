import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HistoryLibrarian.css";

const HistoryLibrarian = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoryData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/students/records/all-time-in",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sortedRecords = response.data.records
          .flatMap((record) =>
            record.rfidScans.map((scan) => ({
              studentName: record.name,
              studentNumber: record.studentNumber,
              institute: record.institute, // Include institute
              timestamp: new Date(scan.timestamp),
            }))
          )
          .sort((a, b) => b.timestamp - a.timestamp); // Sort by latest first

        setHistoryData(sortedRecords);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  if (loading) {
    return <div className="history">Loading...</div>;
  }

  if (error) {
    return <div className="history error">{error}</div>;
  }

  return (
    <div className="history">
      <h2 className="history-title">RFID Check-In History</h2>
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Institute</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((record, index) => (
              <tr key={index}>
                <td>{record.studentNumber}</td>
                <td>{record.studentName}</td>
                <td>{record.institute}</td>
                <td>{record.timestamp.toLocaleDateString()}</td>
                <td>{record.timestamp.toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryLibrarian;
