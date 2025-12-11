import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import {
  ResponsiveContainer,
  BarChart, Bar,
  XAxis, YAxis,
  LineChart, Line,
  Tooltip,
  Cell
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
        1. TOP 5 MOST COMMON TYPES OF VIOLENCE
  ---------------------------------------------------- */
  const categoryCount = incidentes.reduce((acc, inc) => {
    const category = inc.category || 'Not specified';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const top5Categories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({
      category,
      count,
      percentage: ((count / incidentes.length) * 100).toFixed(1)
    }));

  /* ----------------------------------------------------
        2. MOST COMMON LOCATIONS (TOP 5)
  ---------------------------------------------------- */
  const locationCount = incidentes.reduce((acc, inc) => {
    // Use 'zone' field that comes mapped with location name from backend
    const location = inc.zone || 'Not specified';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const top5Locations = Object.entries(locationCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([location, count]) => ({
      location,
      count
    }));

  /* ----------------------------------------------------
        3. MONTHLY TREND OF REPORTS (LAST YEAR)
  ---------------------------------------------------- */
  // Calculate date from 12 months ago
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // Filter incidents from last year
  const lastYearIncidents = incidentes.filter(inc => {
    const incDate = new Date(inc.date);
    return incDate >= oneYearAgo && incDate <= today;
  });

  const monthlyCount = lastYearIncidents.reduce((acc, inc) => {
    const month = inc.date.slice(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const monthlyTrend = Object.entries(monthlyCount)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => {
      // Convert YYYY-MM to more readable format
      const [year, monthNum] = month.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        month: `${monthNames[parseInt(monthNum) - 1]} ${year.slice(2)}`,
        count,
        fullDate: month
      };
    });

  /* ----------------------------------------------------
        4. ANNUAL TREND (LAST 5-10 YEARS)
  ---------------------------------------------------- */
  const yearlyCount = incidentes.reduce((acc, inc) => {
    const year = inc.date.slice(0, 4); // YYYY
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const yearlyTrend = Object.entries(yearlyCount)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([year, count]) => ({
      year,
      count
    }));

  /* ----------------------------------------------------
        5. MOST AFFECTED AGE RANGE
  ---------------------------------------------------- */
  function groupAge(age) {
    if (age <= 18) return "Under 18";
    if (age <= 22) return "18-22 years";
    if (age <= 26) return "23-26 years";
    if (age <= 30) return "27-30 years";
    return "Over 30";
  }

  const ageCount = incidentes.reduce((acc, inc) => {
    const group = groupAge(inc.age);
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  // Define correct order of age ranges
  const ageOrder = ["Under 18", "18-22 years", "23-26 years", "27-30 years", "Over 30"];
  
  const ageData = ageOrder
    .filter(range => ageCount[range] > 0) // Only include ranges with data
    .map(range => ({
      range,
      count: ageCount[range]
    }));

  /* ----------------------------------------------------
        6. PEAK MONTH FOR REPORTS
  ---------------------------------------------------- */
  const monthlyCountAllTime = incidentes.reduce((acc, inc) => {
    const monthNum = new Date(inc.date).getMonth(); // 0-11
    acc[monthNum] = (acc[monthNum] || 0) + 1;
    return acc;
  }, {});

  // Find month with most historical reports
  const peakMonth = Object.entries(monthlyCountAllTime)
    .sort((a, b) => b[1] - a[1])[0];
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  const peakMonthName = peakMonth ? monthNames[parseInt(peakMonth[0])] : 'N/A';

  /* ----------------------------------------------------
        7. GENERAL SUMMARY
  ---------------------------------------------------- */
  const totalReports = incidentes.length;
  const mostCommonCategory = top5Categories[0]?.category || 'N/A';
  const mostCommonLocation = top5Locations[0]?.location || 'N/A';

  // Colores para las gráficas
  const COLORS = ['#7a3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  return (
    <div className="report-container">
      <Header view="map" />

      <div className="report-content">
        <h1
          className="form-title"
          style={{ textAlign: "center", padding: "0.1rem" }}
        >
          Map of recent violence reports
        </h1>

        <p
          className="form-subtitle"
          style={{
            textAlign: "center",
            fontSize: "1.2rem",
            padding: "0.3rem",
          }}
        >
          These are the areas with the most cases
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
      </div>

      <h1 className="form-title" style={{ color: "black", textAlign: "center", marginTop: '3rem', marginBottom: "2rem" }}>Statistics</h1>

      {/* RESUMEN ESTADÍSTICO */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '1rem', 
        marginBottom: '2rem',
        padding: '0 1rem'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #7a3aed 0%, #9d5cff 100%)', 
          padding: '1.5rem', 
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '120px'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalReports}</div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Total Reports</div>
        </div>
        <div style={{ 
          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', 
          padding: '1.5rem', 
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '120px'
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.3' }}>{mostCommonCategory}</div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Most Common Type</div>
        </div>
        <div style={{ 
          background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', 
          padding: '1.5rem', 
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '120px'
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.3' }}>{mostCommonLocation}</div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Most Common Location</div>
        </div>
        <div style={{ 
          background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', 
          padding: '1.5rem', 
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '120px'
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.3' }}>{peakMonthName}</div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Peak Month</div>
        </div>
      </div>

      <div className="statistics-view">
        <div className="statistics-charts-container">

          {/* ===== 1. TOP 5 TYPES OF VIOLENCE ===== */}
          <div className="chart-box">
            <h2 className="chart-title">Top 5 Most Reported Types of Violence</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', textAlign: 'center' }}>
              Shows the five most frequently reported categories of violence on campus
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={top5Categories} layout="vertical" margin={{ left: 20, right: 20 }}>
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="category" 
                  width={isMobile ? 90 : 120}
                  tick={{ fontSize: isMobile ? 11 : 14 }}
                />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} reports (${props.payload.percentage}%)`, 
                    'Total'
                  ]}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {top5Categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ===== 2. TOP 5 MOST COMMON LOCATIONS ===== */}
          <div className="chart-box">
            <h2 className="chart-title">Top 5 Locations with Most Incidents</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', textAlign: 'center' }}>
              Identifies the campus areas where most violence cases have been reported
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={top5Locations} layout="vertical" margin={{ left: 20, right: 20 }}>
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="location" 
                  width={isMobile ? 90 : 120}
                  tick={{ fontSize: isMobile ? 11 : 14 }}
                />
                <Tooltip formatter={(value) => [`${value} reports`, 'Total']} />
                <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ===== 3. MONTHLY TREND (LAST YEAR) ===== */}
          <div className="chart-box" style={{ gridColumn: '1 / -1' }}>
            <h2 className="chart-title">Monthly Report Trends (Last 12 Months)</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', textAlign: 'center' }}>
              Track how the number of violence reports has changed over the past year
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} reports`, 'Total']} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#7a3aed" 
                  strokeWidth={3}
                  dot={{ fill: '#7a3aed', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ===== 4. ANNUAL TREND ===== */}
          <div className="chart-box" style={{ gridColumn: '1 / -1' }}>
            <h2 className="chart-title">Annual Report Evolution</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', textAlign: 'center' }}>
              Compare the total number of violence reports across different years (current year highlighted in purple)
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={yearlyTrend}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} reports`, 'Annual Total']} />
                <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]}>
                  {yearlyTrend.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === yearlyTrend.length - 1 ? '#7a3aed' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ===== 5. AGE RANGE ===== */}
          <div className="chart-box">
            <h2 className="chart-title">Distribution by Age Range</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', textAlign: 'center' }}>
              Shows which age groups are most affected by violence on campus
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={ageData}>
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} reports`, 'Total']} />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>

      <Hero />
    </div>
  );
}

export default Statistics;