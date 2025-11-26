import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./vistas/Login.jsx";
import CreateAccount from "./vistas/CreateAccount.jsx";
import Map from "./vistas/Map.jsx";
import Report from "./vistas/Report.jsx";
import PersonalStatistics from "./vistas/PersonalStatistics.jsx";
import ForgotPassword from "./vistas/ForgotPassword.jsx";
import DefineAdmin from "./vistas/DefineAdmin.jsx";
import AdminStatistics from "./vistas/AdminStatistics.jsx";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/map" element={<Map />} />
        <Route path="/report" element={<Report />} />
        <Route path="/personalStatistics" element={<PersonalStatistics />} />
        <Route path="/adminStatistics" element={<AdminStatistics />} />
        <Route path="/defineAdmin" element={<DefineAdmin />} />
      </Routes>
  );
}