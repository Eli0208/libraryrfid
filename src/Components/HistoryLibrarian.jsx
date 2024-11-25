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
          "http://localhost:5000/api/students/time-ins",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const sortedRecords = response.data.timeIns
          .map((record) => {
            // Adjust the date from UTC to Philippine Standard Time (PST)
            const utcDate = new Date(record.date); // Get UTC date from the API
            const pstDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000); // Add 8 hours for PST

            const timestamp = new Date(
              `${pstDate.toISOString().split("T")[0]}T${record.time}`
            );

            return {
              id: record.id,
              studentNumber: record.studentNumber,
              studentName: record.name,
              institute: record.institute,
              timestamp, // Use adjusted timestamp
            };
          })
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
      setFilteredData(historyData); // Reset filter if no dates selected
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setError("Start date must be earlier than or equal to the end date.");
      return;
    }

    const filtered = historyData.filter(
      (record) => record.timestamp >= start && record.timestamp <= end
    );

    setFilteredData(filtered);
    setError(null); // Clear previous error
  };

  const exportToPDF = () => {
    if (filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

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

    const finalY = doc.autoTable.previous.finalY + 10;
    const uniqueInstitutes = new Set(
      filteredData.map((record) => record.institute)
    ).size;
    const studentCount = filteredData.length;

    const hourCounts = filteredData.reduce((acc, record) => {
      const hour = record.timestamp.getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const peakHours = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour, count]) => `${hour}:00 - ${hour}:59 (${count} entries)`);

    doc.text("Library Analytics", 14, finalY);
    doc.text(`Total Institutes: ${uniqueInstitutes}`, 14, finalY + 10);
    doc.text(`Total Students Timed In: ${studentCount}`, 14, finalY + 20);
    doc.text("Peak Hours:", 14, finalY + 30);
    peakHours.forEach((hour, index) => {
      doc.text(`${index + 1}. ${hour}`, 20, finalY + 40 + index * 10);
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
        <button onClick={handleFilter} disabled={loading}>
          Filter
        </button>
        <button onClick={exportToPDF} disabled={filteredData.length === 0}>
          Export to PDF
        </button>
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
