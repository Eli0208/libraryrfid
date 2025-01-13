import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering necessary chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SignInChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/students/time-ins"
        );
        const timeInsData = response.data.timeIns;

        // Extract unique institutes from the timeIns data
        const institutes = [
          ...new Set(timeInsData.map((timeIn) => timeIn.institute)),
        ];

        // Initialize counters for time periods and institutes dynamically
        const timePeriods = {
          "7-9 AM": {},
          "9-11 AM": {},
          "11 AM-1 PM": {},
          "1-3 PM": {},
          "3-5 PM": {},
          "5-7 PM": {},
          "After Hours": {},
        };

        // Initialize the counts for each institute
        institutes.forEach((institute) => {
          Object.keys(timePeriods).forEach((timePeriod) => {
            timePeriods[timePeriod][institute] = 0;
          });
        });

        // Process time-ins data and count by time period and institute
        timeInsData.forEach((timeIn) => {
          const hour = new Date(timeIn.date).getHours();
          const institute = timeIn.institute;

          let timePeriod = "";
          if (hour >= 7 && hour < 9) timePeriod = "7-9 AM";
          else if (hour >= 9 && hour < 11) timePeriod = "9-11 AM";
          else if (hour >= 11 && hour < 13) timePeriod = "11 AM-1 PM";
          else if (hour >= 13 && hour < 15) timePeriod = "1-3 PM";
          else if (hour >= 15 && hour < 17) timePeriod = "3-5 PM";
          else if (hour >= 17 && hour < 19) timePeriod = "5-7 PM";
          else timePeriod = "After Hours"; // For sign-ins after 7 PM

          if (timePeriod) {
            // Increment the counter for the corresponding institute and time period
            timePeriods[timePeriod][institute] += 1;
          }
        });

        // Prepare chart data dynamically from the processed timePeriods
        const chartLabels = Object.keys(timePeriods);
        const datasets = institutes.map((institute) => ({
          label: institute,
          data: chartLabels.map((period) => timePeriods[period][institute]),
          backgroundColor: getRandomColor(),
        }));

        setChartData({
          labels: chartLabels,
          datasets: datasets,
        });

        setLoading(false);
      } catch (err) {
        setError("Error fetching data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to generate random color for each institute
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Chart options to position title at the top
  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: "Sign-In Time by Institute",
        font: {
          size: 24, // Increase font size if needed
          weight: "bold",
        },
        padding: {
          top: 20, // Adjust space above the title
          bottom: 30, // Adjust space between title and chart
        },
        align: "center", // Ensures the title is centered
      },
    },
  };

  if (loading) {
    return <p>Loading sign-in data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="chart-container">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default SignInChart;
