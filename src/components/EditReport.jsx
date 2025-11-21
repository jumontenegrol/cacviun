import React, { useState } from "react";
import "./../styles/EditReport.css";

function EditReport({ report, onClose, onSave }) {
  const [formData, setFormData] = useState(report);
  const [errors, setErrors] = useState({});

  const violenceTypes = [
    "Physical Violence",
    "Psychological Violence",
    "Sexual Violence",
    "Workplace Violence",
    "Discrimination",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.age || Number(formData.age) <= 0) {
      newErrors.age = "Age must be a number greater than zero.";
    }

    if (!violenceTypes.includes(formData.category)) {
      newErrors.category = "Select a valid type of violence.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; 
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="edit-overlay">
      <div className="edit-box" role="dialog">
        <h2>Edit Report</h2>
        <h4>You are only allowed to change the type of violence and the description.</h4>

        <form>
          
          <label>Email</label>
          <input
            name="correo"
            value={formData.user_email}
            onChange={handleChange}
          />

          <label>Age</label>
          <input
            name="edad"
            value={formData.age}
            onChange={handleChange}
            type="number"
          />
          {errors.age && <p className="error">{errors.age}</p>}

          <label>Date</label>
          <input
            type="date"
            name="fecha"
            value={formData.date}
            onChange={handleChange}
          />

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
          {errors.category && (
            <p className="error">{errors.category}</p>
          )}

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

        
        </form>

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
