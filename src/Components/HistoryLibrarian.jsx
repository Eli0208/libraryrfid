import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Chart, registerables } from "chart.js";
import ExcelJS from "exceljs"; // Import exceljs
import "./HistoryLibrarian.css";

Chart.register(...registerables);

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
            const utcDate = new Date(record.date);
            const pstDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000); // Adjust to PST
            const timestamp = new Date(
              `${pstDate.toISOString().split("T")[0]}T${record.time}`
            );

            return {
              id: record.id,
              studentNumber: record.studentNumber,
              studentName: record.name,
              institute: record.institute,
              timestamp,
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
      setFilteredData(historyData);
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
    setError(null);
  };

  const exportToExcel = async () => {
    if (filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Data calculations
    const studentPerInstitute = {};
    const peakHours = Array(24).fill(0);
    const uniqueStudents = new Set();
    const uniqueInstitutes = new Set();

    filteredData.forEach((record) => {
      studentPerInstitute[record.institute] =
        (studentPerInstitute[record.institute] || 0) + 1;

      uniqueStudents.add(record.studentNumber);
      uniqueInstitutes.add(record.institute);

      const hour = record.timestamp.getHours();
      peakHours[hour]++;
    });

    const totalStudents = uniqueStudents.size;
    const totalInstitutes = uniqueInstitutes.size;
    const totalPeakHours = peakHours.reduce((a, b) => a + b, 0);

    // Generate Chart Images with Chart.js
    const chartCanvas1 = document.createElement("canvas");
    chartCanvas1.width = 2400; // 300% wider
    chartCanvas1.height = 400;

    const chartData1 = {
      labels: Object.keys(studentPerInstitute),
      datasets: [
        {
          label: "Students per Institute",
          data: Object.values(studentPerInstitute),
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    };

    const chart1 = new Chart(chartCanvas1, {
      type: "bar",
      data: chartData1,
      options: {
        responsive: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    // Chart 2: Peak Hours
    const chartCanvas2 = document.createElement("canvas");
    chartCanvas2.width = 2400; // 300% wider
    chartCanvas2.height = 400;

    const chartData2 = {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [
        {
          label: "Check-ins per Hour",
          data: peakHours,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const chart2 = new Chart(chartCanvas2, {
      type: "line",
      data: chartData2,
      options: {
        responsive: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const chartImage1 = chartCanvas1.toDataURL("image/png");
    const chartImage2 = chartCanvas2.toDataURL("image/png");

    // Prepare data for Excel (Data Summary)
    const dataSummary = [
      ["Total Students Timed In", totalStudents],
      ["Total Institutes Timed In", totalInstitutes],
      ["Total Peak Hours", totalPeakHours],
    ];

    const institutesTimedIn = Object.keys(studentPerInstitute);
    const studentsPerInstitute = Object.entries(studentPerInstitute).map(
      ([institute, count]) => [`${institute}: ${count} students`]
    );

    // Create Excel file using exceljs
    const workbook = new ExcelJS.Workbook();
    const sheet1 = workbook.addWorksheet("Data");

    // Add table headers
    sheet1.addRow(["Student ID", "Student Name", "Institute", "Date", "Time"]);

    filteredData.forEach((record) => {
      sheet1.addRow([
        record.studentNumber,
        record.studentName,
        record.institute,
        record.timestamp.toLocaleDateString(),
        record.timestamp.toLocaleTimeString(),
      ]);
    });

    // Add chart images to the second sheet
    const sheet2 = workbook.addWorksheet("Charts");

    // Add data summary above the images in Sheet 2
    sheet2.addRow(["Data Summary"]);
    dataSummary.forEach(([label, value]) => {
      sheet2.addRow([label, value]);
    });

    // Add "Institutes Timed In" below the data summary
    sheet2.addRow([]);
    sheet2.addRow(["Institutes Timed In"]);
    institutesTimedIn.forEach((institute) => {
      sheet2.addRow([institute]);
    });

    // Add some spacing
    sheet2.addRow([]);

    // Insert Chart 1 above the first chart image
    const image1 = await workbook.addImage({
      base64: chartImage1,
      extension: "png",
    });
    sheet2.addImage(image1, "A10:G20");

    // Insert Chart 2 above the second chart image
    const image2 = await workbook.addImage({
      base64: chartImage2,
      extension: "png",
    });
    sheet2.addImage(image2, "A22:G32");

    // Write to file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "RFID_CheckIn_History_with_Charts.xlsx";
      link.click();
    });
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
        <button onClick={exportToExcel} disabled={filteredData.length === 0}>
          Export to Excel
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
            {filteredData.map((record) => (
              <tr key={record.id}>
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
