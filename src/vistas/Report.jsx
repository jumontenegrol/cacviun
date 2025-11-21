import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/Report.css";
import Header from "../components/Header";

const violenceTypes = [
  "Physical Violence",
  "Psychological Violence",
  "Sexual Violence",
  "Workplace Violence",
  "Discrimination",
];

function Report() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  // Estado para mostrar u ocultar la ventana emergente
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !age.trim() || !date.trim() || !type.trim()) {
      toast.error("All required fields must be filled", { position: "top-center" });
      return;
    }

    // Email institucional obligatorio
    const emailRegex = /^[^\s@]+@unal\.edu\.co$/;
    if (!emailRegex.test(email)) {
      toast.error("Email must be @unal.edu.co", { position: "top-center" });
      return;
    }

    if (isNaN(age) || Number(age) <= 0) {
      toast.error("Age must be a valid positive number", { position: "top-center" });
      return;
    }

    // Validación de fecha
    const selectedDate = new Date(date);
    const minDate = new Date("2000-01-01");
    const today = new Date();

    if (selectedDate < minDate) {
      toast.error("Date must be after the year 2000", { position: "top-center" });
      return;
    }

    if (selectedDate > today) {
      toast.error("Date must be before today", { position: "top-center" });
      return;
    }

    // 👉 Mostrar ventana emergente de confirmación
    setShowConfirm(true);
  };


  const confirmSubmit = () => {
    toast.success("Report submitted successfully", {
      position: "top-center",
      autoClose: 2000,
    });

    // Reset form
    setName("");
    setEmail("");
    setAge("");
    setDate("");
    setType("");
    setDescription("");

    setShowConfirm(false);
  };

  const confirmationModal = (
    <div className="modal-background">
      <div className="modal-box">
        <h3>Confirmation Required</h3>
        <p>
          Are you completely sure that all the information entered is correct
          and you want to submit this report?
        </p>

        <div className="modal-buttons">
          <button className="yes-btn" onClick={confirmSubmit}>YES</button>
          <button className="no-btn" onClick={() => setShowConfirm(false)}>NO</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="report-container">
      <Header />

      {showConfirm && confirmationModal}

      <div className="report-content">
        <div className="form-header-text">
          <h1 className="form-title">Make your Report</h1>
          <p className="form-subtitle">Please complete the survey</p>
        </div>

        <form onSubmit={handleSubmit} className="report-form-single-column">

          <div className="form-group">
            <label htmlFor="name">NAME AND LAST NAME</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your @unal.edu.co email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">AGE</label>
            <input
              type="number"
              id="age"
              placeholder="Your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">DATE OF EVENT</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">TYPE OF VIOLENCE</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select</option>

              {violenceTypes.map((t, index) => (
                <option key={index} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">PLEASE DESCRIBE THE EVENT</label>
            <textarea
              id="description"
              placeholder="Describe the event (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label>SELECT THE AREA WHERE THE EVENT OCCURRED</label>
            <div
              style={{
                height: "400px",
                width: "100%",
                background: "#e5e5e5",
                borderRadius: "8px",
                border: "2px dashed gray",
                marginTop: "0.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#555",
                fontStyle: "italic",
              }}
            >
              🔲 Map frame (empty)
            </div>
          </div>

          <button type="submit" className="submit-btn">
            SEND THE REPORT
          </button>
        </form>

        <p
          className="form-subtitle"
          style={{ textAlign: "center", fontSize: "0.6rem" }}
        >
          🟣 This color symbolizes our dedication to eliminating all forms of
          violence.
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Report;
