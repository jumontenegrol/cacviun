import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { ResponsiveContainer, PieChart, Pie, Tooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line } from "recharts";
import "./../styles/StatisticsCharts.css";
import "./../styles/Report.css";

function Statistics() {
  const [incidentes, setIncidentes] = useState([]);
  const path = "https://cacviun-backend.onrender.com";

  const fetchData = async () => {
    try {
      const res = await fetch(`${path}/report/admin-history`);

      if (!res.ok) {
        console.error("Error fetching statistics");
        return;
      }

      const data = await res.json();
      setIncidentes(data.reportHistory || []);
    } catch (error) {
      console.error("Server error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // 1. By Category
  const categoryCount = incidentes.reduce((acc, inc) => {
    acc[inc.category] = (acc[inc.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryCount).map(([category, value]) => ({
    category,
    value,
  }));

  // 2. Age Groups
  function groupAge(age) {
    if (age <= 20) return "15–20";
    if (age <= 25) return "21–25";
    if (age <= 30) return "26–30";
    return "31+";
  }

  const ageCount = incidentes.reduce((acc, inc) => {
    const group = groupAge(inc.age);
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  const ageData = Object.entries(ageCount).map(([range, count]) => ({
    range,
    count,
  }));

  // 3. Reports Over Time
  const dateCount = incidentes.reduce((acc, inc) => {
    const date = inc.date.split("T")[0]; // remove hours
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const dateData = Object.entries(dateCount).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="report-container">
      <Header view="map" />

      <div className="report-content">
        <h1
          className="form-title"
          style={{ textAlign: "center", padding: "0.1rem" }}
        >
          MAP
        </h1>

        <p
          className="form-subtitle"
          style={{
            textAlign: "center",
            fontSize: "0.8rem",
            padding: "0.3rem",
          }}
        >
          HERE YOU WILL SEE THE AREAS WITH THE MOST RECORDED CASES
        </p>

        {/* FRAME DEL MAPA */}
        <div
          style={{
            height: "400px",
            width: "100%",
            backgroundColor: "#f2f2f2",
            borderRadius: "8px",
            border: "1px solid #ccc",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#999",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          MAP FRAME
        </div>
        <div className="statistics-view">

      <div className="statistics-charts-container">
        <h1 className="page-title">📊 STATISTICS OVERVIEW</h1>
        <p className="page-subtitle">
          Analysis of the reports made by all users in the system.
        </p>

        {/* ========================================= */}
        {/* CATEGORY PIE CHART */}
        {/* ========================================= */}
        <div className="chart-box">
          <h2 className="chart-title">Distribution by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#7a3aed"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ========================================= */}
        {/* AGE BAR CHART */}
        {/* ========================================= */}
        <div className="chart-box">
          <h2 className="chart-title">Reports by Age Group</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData}>
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ========================================= */}
        {/* LINE CHART – REPORT TREND */}
        {/* ========================================= */}
        <div className="chart-box">
          <h2 className="chart-title">Reports Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dateData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

        <p
          className="form-subtitle"
          style={{ textAlign: "center", fontSize: "0.6rem" }}
        >
          🟣 This color symbolizes our dedication to eliminating all forms of
          violence.
        </p>
      </div>
    </div>
  );
}

export default Statistics;
