import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TimeInsStudent.css";

const TimeInsStudent = ({ token }) => {
  const [timeIns, setTimeIns] = useState([]);
  const [todayTimeIns, setTodayTimeIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeIns = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/students/time-ins",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Filter time-ins for today
        const filteredTimeIns = response.data.timeIns.filter((timeIn) => {
          const timeInDate = new Date(timeIn.date);
          return timeInDate >= startOfDay && timeInDate <= endOfDay;
        });

        setTimeIns(filteredTimeIns);
        setTodayTimeIns(filteredTimeIns);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchTimeIns();
  }, [token]);

  if (loading) return <p>Loading time-ins...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="time-ins-table-container">
      <h2>Today's Time-Ins</h2>
      {todayTimeIns.length > 0 ? (
        <table className="time-ins-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Number</th>
              <th>Name</th>
              <th>Institute</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {todayTimeIns.map((timeIn) => (
              <tr key={timeIn.id}>
                <td>{timeIn.id}</td>
                <td>{timeIn.studentNumber}</td>
                <td>{timeIn.name}</td>
                <td>{timeIn.institute}</td>
                <td>{new Date(timeIn.date).toLocaleDateString()}</td>
                <td>{timeIn.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No time-ins recorded for today.</p>
      )}
    </div>
  );
};

export default TimeInsStudent;
