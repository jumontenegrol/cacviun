import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./vistas/Login.jsx";

export default function App() {
  return (
    <BrowserRouter basename="/cacviun"> {/* <- IMPORTANTE para GitHub Pages */}
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}