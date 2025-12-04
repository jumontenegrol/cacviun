import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  ResponsiveContainer,
  PieChart, Pie,
  Tooltip,
  BarChart, Bar,
  XAxis, YAxis,
  LineChart, Line,
  AreaChart, Area
} from "recharts";
import "./../styles/Dashboard.css";
import "./../styles/Report.css";

function Statistics() {
  const [incidentes, setIncidentes] = useState([]);
  const path = "https://cacviun-backend.onrender.com";

  const fetchData = async () => {
    try {
      const res = await fetch(`${path}/report/admin-history`);
      if (!res.ok) return console.error("Error fetching statistics");

      const data = await res.json();
      setIncidentes(data.reportHistory || []);
    } catch (error) {
      console.error("Server error", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* ----------------------------------------------------
        1. CATEGORY PIE CHART
  ---------------------------------------------------- */
  const categoryCount = incidentes.reduce((acc, inc) => {
    acc[inc.category] = (acc[inc.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryCount).map(([category, value]) => ({
    category,
    value,
  }));

  /* ----------------------------------------------------
        2. AGE RANGE BAR CHART
  ---------------------------------------------------- */
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

  /* ----------------------------------------------------
        3. REPORTS OVER TIME (Line)
  ---------------------------------------------------- */
  const dateCount = incidentes.reduce((acc, inc) => {
    const date = inc.date.split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const dateData = Object.entries(dateCount).map(([date, count]) => ({
    date,
    count,
  }));

  /* ----------------------------------------------------
        4. NEW: CATEGORY vs AGE (Stacked Bars)
  ---------------------------------------------------- */
  const stackedMap = {};

  incidentes.forEach((inc) => {
    const ageGroup = groupAge(inc.age);
    const cat = inc.category;

    if (!stackedMap[ageGroup]) stackedMap[ageGroup] = {};
    stackedMap[ageGroup][cat] = (stackedMap[ageGroup][cat] || 0) + 1;
  });

  const stackedData = Object.entries(stackedMap).map(([ageGroup, cats]) => ({
    ageGroup,
    ...cats 
  }));

  const categoryKeys = Object.keys(categoryCount);

  /* ----------------------------------------------------
        5. NEW: CATEGORY OVER MONTHS (Area Chart)
  ---------------------------------------------------- */
  const monthlyMap = {};

  incidentes.forEach((inc) => {
    const month = inc.date.slice(0, 7); // YYYY-MM
    const cat = inc.category;

    if (!monthlyMap[month]) monthlyMap[month] = {};
    monthlyMap[month][cat] = (monthlyMap[month][cat] || 0) + 1;
  });

  const monthlyData = Object.entries(monthlyMap).map(([month, cats]) => ({
    month,
    ...cats
  }));

  /* ----------------------------------------------------
        6. NEW: HEATMAP SIMPLIFIED (Bar Grid)
  ---------------------------------------------------- */
  const heatMapData = Object.entries(stackedMap).flatMap(([ageGroup, cats]) =>
    Object.entries(cats).map(([cat, value]) => ({
      ageGroup,
      category: cat,
      value
    }))
  );

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

        <h1 className="form-title" style={{ textAlign: "center" }}>STATISTICS</h1>

        <div className="statistics-view">
          <div className="statistics-charts-container">

            {/* ===== 1 PIE ===== */}
            <div className="chart-box">
              <h2 className="chart-title">Distribution by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={110} fill="#7a3aed" label />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* ===== 2 AGE BAR ===== */}
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

            {/* ===== 3 LINE OVER TIME ===== */}
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

            {/* ===== 4 STACKED BAR ===== */}
            <div className="chart-box">
              <h2 className="chart-title">Category vs Age Range</h2>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={stackedData}>
                  <XAxis dataKey="ageGroup" />
                  <YAxis />
                  <Tooltip />
                  {categoryKeys.map((cat, i) => (
                    <Bar key={i} dataKey={cat} stackId="a" />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ===== 5 AREA MONTHLY ===== */}
            <div className="chart-box">
              <h2 className="chart-title">Category Reports per Month</h2>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  {categoryKeys.map((cat, i) => (
                    <Area key={i} type="monotone" dataKey={cat} fillOpacity={0.4} strokeWidth={2} />
                  ))}
                </AreaChart>
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
