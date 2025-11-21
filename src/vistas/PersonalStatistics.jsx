import React, { useState } from "react";
import Header from "../components/Header";
import "./../styles/Statistics.css";
import { ToastContainer, toast } from "react-toastify";
import DeleteConfirm from "../components/DeleteReport";
import EditReport from "../components/EditReport";

function PersonalStatistics() {
  // Lista local vacía que luego será reemplazada por datos del backend
  const [incidentes, setIncidentes] = useState([
    // Ejemplo de estructura (no se llena):
     {
       nombre: "Juan",
       correo: "Jumo",
       edad: "12",
       fecha: "125",
       tipo_de_violencia: "yo",
       descripcion: "y",
       zona: "test",
     }
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedReport, setSelectedReport] = useState(null);

  // DELETE — abre modal
  const handleDeleteClick = (rep) => {
    setSelectedReport(rep);
    setShowDeleteModal(true);
  };

  //DELETE — ejecuta confirmación
  const confirmDelete = () => {
    setIncidentes((prev) => prev.filter((x) => x.id !== selectedReport.id));
    toast.success("Report deleted successfully!", { theme: "colored" });
    setShowDeleteModal(false);
  };

  // EDIT — abre modal
  const handleEditClick = (rep) => {
    setSelectedReport(rep);
    setShowEditModal(true);
  };

  // EDIT — guardar cambios
  const saveEditedReport = (editedData) => {
    setIncidentes((prev) =>
      prev.map((r) => (r.id === editedData.id ? editedData : r))
    );

    toast.success("Report updated successfully!", { theme: "colored" });
    setShowEditModal(false);
  };

  return (
    <div className="Statistics-container">
      <Header view="statistics" />

      <div className="Statistics-content">
        <h1
          className="Statistics-form-title"
          style={{ textAlign: "center", padding: "0.1rem" }}
        >
          STATISTICS
        </h1>

        <p
          className="Statistics-form-subtitle"
          style={{ textAlign: "center", fontSize: "0.8rem", padding: "0.3rem" }}
        >
          IN THIS SPACE YOU CAN SEE THE GENERAL STATISTICS
        </p>

        {/* Tabla de incidentes */}
        {incidentes.length > 0 ? (
          <div className="tabla-container">
            <table className="tabla-incidentes">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Edad</th>
                  <th>Fecha</th>
                  <th>Tipo de violencia</th>
                  <th>Descripción</th>
                  <th>Zona</th>
                </tr>
              </thead>

              <tbody>
                {incidentes.map((inc, index) => (
                  <tr key={index}>
                    <td>{inc.nombre}</td>
                    <td>{inc.correo}</td>
                    <td>{inc.edad}</td>
                    <td>{inc.fecha}</td>
                    <td>{inc.tipo_de_violencia}</td>
                    <td>{inc.descripcion}</td>
                    <td>{inc.zona}</td>

                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEditClick(inc)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteClick(inc)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: "center", fontSize: "0.8rem" }}>
            No data available.
          </p>
        )}

        <p
          className="form-subtitle"
          style={{ textAlign: "center", fontSize: "0.6rem" }}
        >
          🟣 This color symbolizes our dedication to eliminating all forms of
          violence.
        </p>
      </div>

      <ToastContainer />

      {showDeleteModal && (
        <DeleteConfirm
          report={selectedReport}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}

      {showEditModal && (
        <EditReport
          report={selectedReport}
          onClose={() => setShowEditModal(false)}
          onSave={saveEditedReport}
        />
      )}
    </div>
  );
}

export default PersonalStatistics;