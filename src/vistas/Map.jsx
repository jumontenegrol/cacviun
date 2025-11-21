import React from "react";
import "./../styles/Report.css";
import Header from "../components/Header";

function Map() {
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

export default Map;
