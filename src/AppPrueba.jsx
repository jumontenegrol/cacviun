import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPrueba from "./vistas/LoginPrueba.jsx";
import CreateAccountPrueba from "./vistas/CreateAccountPrueba.jsx";
import MapPrueba from "./vistas/MapPrueba.jsx";
import ReportPrueba from "./vistas/ReportPrueba.jsx";
import PersonalStatisticsPrueba from "./vistas/PersonalStatisticsPrueba.jsx";

export default function AppPrueba() {
  return (
    <BrowserRouter basename="/cacviun"> {/* <- IMPORTANTE para GitHub Pages */}
      <Routes>
        <Route path="/" element={<LoginPrueba />} />
        <Route path="/createAccount" element={<CreateAccountPrueba />} />
        <Route path="/mapPrueba" element={<MapPrueba />} />
        <Route path="/reportPrueba" element={<ReportPrueba />} />
        <Route path="/personalStatisticsPrueba" element={<PersonalStatisticsPrueba />} />
      </Routes>
    </BrowserRouter>
  );
}