import React, { useState } from "react";
import "./../styles/EditReport.css";

function EditReport({ report, onClose, onSave }) {
  // -----------------------------
  // Crear copia editable del reporte
  // -----------------------------
  const [formData, setFormData] = useState({
    _id: report._id,
    user_email: report.user_email,
    age: report.age,
    date: report.date,
    category: report.category,
    description: report.description,
    zone: report.zone,
  });

  const [errors, setErrors] = useState({});

  const violenceTypes = [
    "Physical Violence",
    "Psychological Violence",
    "Sexual Violence",
    "Workplace Violence",
    "Discrimination",
  ];

  // -----------------------------
  // Manejar cambios solo en los campos permitidos
  // -----------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // Validación (solo categorías + descripción + age)
  // -----------------------------
  const validate = () => {
    const newErrors = {};

    if (!formData.age || Number(formData.age) <= 0) {
      newErrors.age = "Age must be a number greater than zero.";
    }

    if (!violenceTypes.includes(formData.category)) {
      newErrors.category = "Select a valid type of violence.";
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // Guardar cambios
  // -----------------------------
  const handleSubmit = () => {
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="edit-overlay">
      <div className="edit-box" role="dialog">
        <h2>Edit Report</h2>
        <h4 style={{ marginBottom: "1rem" }}>
          You are only allowed to change the type of violence and the description.
        </h4>

        <form>
          {/* Email */}
          <label>Email</label>
          <input
            name="user_email"
            value={formData.user_email}
            disabled
          />

          {/* Age */}
          <label>Age</label>
          <input
            name="age"
            value={formData.age}
            onChange={handleChange}
            type="number"
            disabled
          />
          {errors.age && <p className="error">{errors.age}</p>}

          {/* Date */}
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            disabled
          />

          {/* Category */}
          <label>Type</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            {violenceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.category && <p className="error">{errors.category}</p>}

          {/* Description */}
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="error">{errors.description}</p>}

          {/* Zone */}
          <label>Zone</label>
          <input
            name="zone"
            value={formData.zone}
            disabled
          />
        </form>

        {/* Botones */}
        <div className="edit-buttons">
          <button className="save-btn" onClick={handleSubmit}>
            Save changes
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditReport;
