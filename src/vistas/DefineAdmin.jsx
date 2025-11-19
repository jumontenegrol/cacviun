import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/Report.css";
import Header from "../components/Header";

function Report() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email field required", { position: "top-center" });
      return;
    }

    // Email institucional obligatorio
    const emailRegex = /^[^\s@]+@unal\.edu\.co$/;
    if (!emailRegex.test(email)) {
      toast.error("Email must be @unal.edu.co", { position: "top-center" });
      return;
    }

    toast.success("administrator successfully assigned", {
      position: "top-center",
      autoClose: 2000,
    });

    setEmail("");
  };

  return (
    <div className="report-container">
      <Header />

      <div className="report-content">
        <div className="form-header-text">
          <h1 className="form-title">Define New Admintrator</h1>
          <p className="form-subtitle">Please enter the email that you want assign as an admin</p>
        </div>

        <form onSubmit={handleSubmit} className="report-form-single-column">

          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              placeholder="Enter the email with @unal.edu.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn">
            ASSIGN AS ADMIN
          </button>
        </form>

      </div>

      <ToastContainer />
    </div>
  );
}

export default Report;
