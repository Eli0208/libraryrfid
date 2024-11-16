import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./HistoryLibrarian.css";

const HistoryLibrarian = () => {
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
          "https://libraryrfid-backend.onrender.com/api/students/records/all-time-in",
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
              institute: record.institute,
              timestamp: new Date(scan.timestamp),
            }))
          )
          .sort((a, b) => b.timestamp - a.timestamp); // Sort by latest first

        setHistoryData(sortedRecords);
        setFilteredData(sortedRecords);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  const handleFilter = () => {
    if (!startDate || !endDate) {
      setFilteredData(historyData); // Reset filter if no dates are selected
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = historyData.filter(
      (record) => record.timestamp >= start && record.timestamp <= end
    );

    setFilteredData(filtered);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Student ID",
      "Student Name",
      "Institute",
      "Date",
      "Time",
    ];
    const tableRows = filteredData.map((record) => [
      record.studentNumber,
      record.studentName,
      record.institute,
      record.timestamp.toLocaleDateString(),
      record.timestamp.toLocaleTimeString(),
    ]);

    doc.text("RFID Check-In History", 14, 20);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save("RFID_CheckIn_History.pdf");
  };

  if (loading) {
    return <div className="history">Loading...</div>;
  }

  if (error) {
    return <div className="history error">{error}</div>;
  }

  return (
    <div className="history">
      <h2 className="history-title">RFID Check-In History</h2>

      {/* Filter Section */}
      <div className="filter-section">
        <label>
          Start Date:
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={handleFilter}>Filter</button>
        <button onClick={exportToPDF}>Export to PDF</button>
      </div>

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
            {filteredData.map((record, index) => (
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
