import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "./../styles/Statistics.css";
import { ToastContainer, toast } from "react-toastify";
import DeleteConfirm from "../components/DeleteReport";
import EditReport from "../components/EditReport";

function extractId(report) {
  if (!report) return null;
  if (report._id && typeof report._id === "string") return report._id;
  if (report._id && report._id.$oid) return report._id.$oid;
  if (report._id && report._id.toString) return report._id.toString();
  if (report.id) return report.id;
  return null;
}

function AdminStatistics() {
  const [incidentes, setIncidentes] = useState([ ]);
  const path = "https://cacviun-backend.onrender.com";
  
  
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${path}/report/admin-history`);

        if (!res.ok) {
          console.error("Error when checking history");
          return;
        }

        const data = await res.json();

        setIncidentes(data.reportHistory || []);

      } catch (error) {
        console.error("Error connecting to server", error);
      }
    };
  useEffect(() => {
    fetchHistory();
  }, []);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedReport, setSelectedReport] = useState(null);

  // DELETE — abre modal
  const handleDeleteClick = (rep) => {
    setSelectedReport(rep);
    setShowDeleteModal(true);
  };

  //DELETE — ejecuta confirmación
  const confirmDelete = async () => {
    try {
      const id = extractId(selectedReport);
      if (!id) {
        toast.error("Invalid report ID", { theme: "colored" });
        return;
      }

      const res = await fetch(`${path}/report/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Report deleted successfully!", { theme: "colored" });
        await fetchHistory(); // recargar lista real
      } else {
        toast.error(data.message || "Error deleting report", {
          theme: "colored",
        });
      }
    } catch (e) {
      console.error(e);
      toast.error("Server error when deleting report", { theme: "colored" });
    }

    setShowDeleteModal(false);
  };

  // EDIT — abre modal
  const handleEditClick = (rep) => {
    setSelectedReport(rep);
    setShowEditModal(true);
  };

  // EDIT — guardar cambios
  const saveEditedReport = async (editedData) => {
    try {
      const id = extractId(editedData);
      if (!id) {
        toast.error("Invalid report ID", { theme: "colored" });
        return;
      }

      const body = {
        category: editedData.category, // string legible
        description: editedData.description,
      };

      const res = await fetch(`${path}/report/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Report updated successfully!", { theme: "colored" });
        await fetchHistory(); // refrescar datos desde backend real
      } else {
        toast.error(data.message || "Error updating report", {
          theme: "colored",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error when updating report", { theme: "colored" });
    }

    setShowEditModal(false);
  };

  // ==========================================
    // PAGINACIÓN + ITERATOR PATTERN
    // ==========================================
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
  
    function createIncidentIterator(collection) {
      let index = 0;
  
      return {
        next: () => {
          if (index < collection.length) {
            return { value: collection[index++], done: false };
          }
          return { done: true };
        },
      };
    }
  
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
  
    const currentIncidents = incidentes.slice(indexOfFirst, indexOfLast);
  
    const iterator = createIncidentIterator(currentIncidents);
  
    let visibleRows = [];
    let step = iterator.next();
    while (!step.done) {
      visibleRows.push(step.value);
      step = iterator.next();
    }
  
    const nextPage = () => {
      if (currentPage < Math.ceil(incidentes.length / itemsPerPage)) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const prevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  

  return (
    <div className="Statistics-container">
      <Header view="statistics" />

      <div className="Statistics-content">
        <h1
          className="Statistics-form-title"
          style={{ textAlign: "center", padding: "0.1rem" }}
        >
          ADMIN STATISTICS
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
                  <th>Email</th>
                  <th>Age</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Zone</th>
                </tr>
              </thead>

              <tbody>
                {visibleRows.map((inc, index) => (
                  <tr key={index}>
                    <td>{inc.user_email}</td>
                    <td>{inc.age}</td>
                    <td>{inc.description}</td>
                    <td>{inc.date}</td>
                    <td>{inc.category}</td>
                    <td>{inc.zone}</td>
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

            {/* PAGINATION */}
            <div className="pagination-controls">
              <button
                disabled={currentPage === 1}
                onClick={prevPage}
                className="pagination-btn"
              >
                ◀ Previous
              </button>

              <span className="pagination-info">
                Page {currentPage} of{" "}
                {Math.ceil(incidentes.length / itemsPerPage)}
              </span>

              <button
                disabled={
                  currentPage === Math.ceil(incidentes.length / itemsPerPage)
                }
                onClick={nextPage}
                className="pagination-btn"
              >
                Next ▶
              </button>
            </div> 
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

export default AdminStatistics;
