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
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import "./../styles/Dashboard.css";
import "./../styles/Report.css";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// HeatmapLayer component to display heat map
function HeatmapLayer({ points }) {
  const map = useMap();
  const heatLayerRef = React.useRef(null);
  const prevPointsRef = React.useRef(null);

  useEffect(() => {
    // Create the heat layer only once
    if (!heatLayerRef.current) {
      heatLayerRef.current = L.heatLayer(points, {
        radius: 25,
        blur: 15,
        maxZoom: 18,
      }).addTo(map);
      prevPointsRef.current = points;
      return;
    }

    // Only update if points actually changed (by reference or content)
    if (prevPointsRef.current !== points && JSON.stringify(prevPointsRef.current) !== JSON.stringify(points)) {
      heatLayerRef.current.setLatLngs(points);
      prevPointsRef.current = points;
    }
  }, [points, map]);

  return null;
}

function Statistics() {
  const [incidentes, setIncidentes] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [heatPoints, setHeatPoints] = useState([]);
  const [recentMarkers, setRecentMarkers] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const path = "https://cacviun-backend.onrender.com";

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${path}/dashboard/get-data`);
      if (!res.ok) return console.error("Error fetching statistics");

      const data = await res.json();
      setIncidentes(data.reportHistory || []);
    } catch (error) {
      console.error("Server error", error);
    }
  };
  
  const fetchMapData = async () => {
    try {
      const res = await fetch(`${path}/dashboard/get-locations`);
      if (!res.ok) return console.error("Error fetching map locations");

      const data = await res.json();
      console.log("Locations data:", data.data);
      setUbicaciones(data.data || []);
    } catch (error) {
      console.error("Server error", error);
    }
  };

  const fetchRecentViolence = async () => {
    try {
      const res = await fetch(`${path}/dashboard/recent-violence`);
      if (!res.ok) return console.error("Error fetching recent violence reports");

      const data = await res.json();
      console.log("Recent reports data:", data.data);
      setRecentReports(data.data || []);
    } catch (error) {
      console.error("Server error", error);
    }
  };

  useEffect(() => { 
    fetchData();
    fetchMapData();
    fetchRecentViolence();
  }, []);

  // Update heatPoints and recentMarkers only when ubicaciones or recentReports change
  useEffect(() => {
    const points = ubicaciones
      .map((u) => [Number(u.latitud), Number(u.longitud)])
      .filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));
    setHeatPoints(points);
  }, [ubicaciones]);

  useEffect(() => {
    const markers = recentReports
      .map((r) => ({
        ...r,
        latitudNum: Number(r.latitud),
        longitudNum: Number(r.longitud),
      }))
      .filter((r) => Number.isFinite(r.latitudNum) && Number.isFinite(r.longitudNum));
    setRecentMarkers(markers);
  }, [recentReports]);

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

  // Heatmap points and markers are now managed by state to prevent recalculation on every render

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
        <div style={{ height: "600px", width: "100%" }}>
          <MapContainer
            center={[4.638193, -74.084046]}
            zoom={16}
            minZoom={16}
            maxZoom={16}
            maxBounds={[
              [4.6325, -74.0875],
              [4.6440, -74.0805],
            ]}
            maxBoundsViscosity={1.0}
            dragging={isMobile}
            zoomControl={isMobile}
            scrollWheelZoom={isMobile}
            doubleClickZoom={isMobile}
            touchZoom={isMobile}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <HeatmapLayer points={heatPoints} />
            {recentMarkers.map((reporte, idx) => (
              <Marker
                key={idx}
                position={[reporte.latitudNum, reporte.longitudNum]}
                icon={customIcon}
              >
                <Popup>
                  <strong>Date:</strong> {reporte.date}
                  <br />
                  <strong>Type:</strong> {reporte.categoryLabel || reporte.category}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
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
