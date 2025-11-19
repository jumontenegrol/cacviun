import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./vistas/Login.jsx";
import CreateAccount from "./vistas/CreateAccount.jsx";
import Map from "./vistas/Map.jsx";
import Report from "./vistas/Report.jsx";
import PersonalStatistics from "./vistas/PersonalStatistics.jsx";
import DefineAdmin from "./vistas/DefineAdmin.jsx";

export default function App() {
  return (
    <BrowserRouter basename="/cacviun"> {/* <- IMPORTANTE para GitHub Pages */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/map" element={<Map />} />
        <Route path="/report" element={<Report />} />
        <Route path="/personalStatistics" element={<PersonalStatistics />} />
        <Route path="/defineAdmin" element={<DefineAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}