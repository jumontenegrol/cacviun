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

    if (!formData.edad || Number(formData.edad) <= 0) {
      newErrors.edad = "Age must be a number greater than zero.";
    }

    if (!violenceTypes.includes(formData.tipo_de_violencia)) {
      newErrors.tipo_de_violencia = "Select a valid type of violence.";
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

        <form>
          <label>Name</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            name="correo"
            value={formData.correo}
            onChange={handleChange}
          />

          <label>Age</label>
          <input
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            type="number"
          />
          {errors.edad && <p className="error">{errors.edad}</p>}

          <label>Date</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
          />

          <label>Type</label>
          <select
            name="tipo_de_violencia"
            value={formData.tipo_de_violencia}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            {violenceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.tipo_de_violencia && (
            <p className="error">{errors.tipo_de_violencia}</p>
          )}

          <label>Description</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />

          <label>Zone</label>
          <input
            name="zona"
            value={formData.zona}
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
