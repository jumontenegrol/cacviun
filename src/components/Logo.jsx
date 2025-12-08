import React from "react";
import logo from "../assets/logoUN-white.png";
import logo_black from "../assets/logoUN-black.png";

function Logo({ variant = "white", width = 280, height = 35 }) {
  const isBlack = variant === "black";
  const imgSrc = isBlack ? logo_black : logo;
  const textColor = isBlack ? "#111827" : "#ffffff";

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: "flex",
        alignItems: "center",
        gap: "20px",
        paddingLeft: "10px",
      }}
    >
      <img src={imgSrc} alt="Logo" style={{ width: 67, height: 29 }} />

      <div
        style={{
          color: textColor,
          fontSize: 36,
          fontFamily: "Inria Sans",
          fontWeight: 700,
        }}
      >
        CACVi-UN
      </div>
    </div>
  );
}

export default Logo;