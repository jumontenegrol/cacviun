import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./vistas/Login.jsx";
import CreateAccount from "./vistas/CreateAccount.jsx";
import Statistics from "./vistas/Statistics.jsx";
import Report from "./vistas/Report.jsx";
import PersonalHistory from "./vistas/PersonalHistory.jsx";
import ForgotPassword from "./vistas/ForgotPassword.jsx";
import DefineAdmin from "./vistas/DefineAdmin.jsx";
import AdminHistory from "./vistas/AdminHistory.jsx";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/report" element={<Report />} />
        <Route path="/personalHistory" element={<PersonalHistory />} />
        <Route path="/adminHistory" element={<AdminHistory />} />
        <Route path="/defineAdmin" element={<DefineAdmin />} />
      </Routes>
  );
}