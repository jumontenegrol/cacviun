import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import "./../styles/Statistics.css";
import { ToastContainer, toast } from "react-toastify";
import DeleteConfirm from "../components/DeleteReport.jsx";
import EditReport from "../components/EditReport.jsx";
import { useSessionStore } from "../session/sessionStore.ts";

// Listas de opciones (deben estar fuera del componente o definidas dentro)
const violenceTypes = [
  "Physical Violence",
  "Psychological Violence",
  "Sexual Violence",
  "Workplace Violence",
  "Discrimination",
];

const zoneOptions = [
  "Universidad Nacional"
];

function extractId(report) {
  if (!report) return null;
  if (report._id && typeof report._id === "string") return report._id;
  if (report._id && report._id.$oid) return report._id.$oid;
  if (report._id && report._id.toString) return report._id.toString();
  if (report.id) return report.id;
  return null;
}

function PersonalHistory() {
  const path = "https://cacviun-backend.onrender.com";
  const session = useSessionStore((state) => state.session);

  const [incidentes, setIncidentes] = useState([]); // Lista completa sin filtrar
  const [filteredIncidents, setFilteredIncidents] = useState([]); // Lista que se muestra
  
  // ==========================================
  // ESTADOS DE FILTROS (SIN user_email)
  // ==========================================
  const [filters, setFilters] = useState({
    ageMin: "",
    ageMax: "",
    category: "",
    zone: "",
    startDate: "",
    endDate: "",
  });

  // Manejador genérico para los cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };


  const fetchHistory = async () => {
    try {
      // Usamos el endpoint personal
      const res = await fetch(`${path}/report/history/${session.email}`);

      if (!res.ok) {
        console.error("Error when checking history");
        return;
      }

      const data = await res.json();
      const allReports = data.reportHistory || [];
      setIncidentes(allReports);
      setFilteredIncidents(allReports); // Inicialmente, la lista filtrada es la lista completa
    } catch (error) {
      console.error("Error connecting to server", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [session.email]);

  // ==========================================
  // FUNCIÓN PRINCIPAL DE FILTRADO (SIN user_email)
  // ==========================================
  useEffect(() => {
    const applyFilters = () => {
      let tempIncidents = incidentes;

      // 1. FILTRO por category
      if (filters.category) {
        tempIncidents = tempIncidents.filter((inc) =>
          inc.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
      
      // 2. FILTRO por zone
      if (filters.zone) {
        tempIncidents = tempIncidents.filter((inc) =>
          inc.zone.toLowerCase() === filters.zone.toLowerCase()
        );
      }

      // 3. FILTRO por age (Rango)
      const minAge = parseInt(filters.ageMin);
      const maxAge = parseInt(filters.ageMax);
      
      if (!isNaN(minAge)) {
          tempIncidents = tempIncidents.filter((inc) => inc.age >= minAge);
      }
      if (!isNaN(maxAge)) {
          tempIncidents = tempIncidents.filter((inc) => inc.age <= maxAge);
      }
      
      // 4. FILTRO por creationTime (Rango de fechas)
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      if (startDate || endDate) {
          tempIncidents = tempIncidents.filter(inc => {
              const dateSource = inc.date || inc.creationTime;
              if (!dateSource) return false;
              
              const reportDate = new Date(dateSource); 
              let isValid = true;
              
              if (startDate) {
                  isValid = isValid && reportDate >= startDate;
              }
              if (endDate) {
                  const nextDay = new Date(endDate);
                  nextDay.setDate(nextDay.getDate() + 1);
                  isValid = isValid && reportDate < nextDay;
              }
              return isValid;
          });
      }


      // Reiniciar la paginación al aplicar un nuevo filtro
      setCurrentPage(1); 
      setFilteredIncidents(tempIncidents);
    };

    applyFilters();
  }, [filters, incidentes]);


  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleDeleteClick = (rep) => {
    setSelectedReport(rep);
    setShowDeleteModal(true);
  };

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
        await fetchHistory();
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

  const handleEditClick = (rep) => {
    setSelectedReport(rep);
    setShowEditModal(true);
  };

  const saveEditedReport = async (editedData) => {
    try {
      const id = extractId(editedData);
      if (!id) {
        toast.error("Invalid report ID", { theme: "colored" });
        return;
      }

      const body = {
        category: editedData.category,
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
        await fetchHistory();
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
  // PAGINACIÓN + ITERATOR PATTERN (usando filteredIncidents)
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

  // ¡Usamos filteredIncidents!
  const currentIncidents = filteredIncidents.slice(indexOfFirst, indexOfLast);

  const iterator = createIncidentIterator(currentIncidents);

  let visibleRows = [];
  let step = iterator.next();
  while (!step.done) {
    visibleRows.push(step.value);
    step = iterator.next();
  }

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredIncidents.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="Statistics-container">
      <Header view="statistics" />

      <div className="Statistics-content">
        <h1 className="Statistics-form-title" style={{ textAlign: "center" }}>
          PERSONAL REPORT HISTORY
        </h1>

        <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
          IN THIS SPACE YOU CAN SEE YOUR PERSONAL REPORT HISTORY
        </p>
        
        {/* ========================================== */}
        {/* CONTROLES DE FILTRO (SIN EMAIL) */}
        {/* ========================================== */}
        <div className="filter-controls">
            
            {/* GRUPO 1: Category y Zone (Dropdowns) */}
            <div className="filter-group">
                {/* Filtro por Category (Dropdown) */}
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="filter-select"
                >
                    <option value="">Filter by Category (All)</option>
                    {violenceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                {/* Filtro por Zone (Dropdown) */}
                <select
                    name="zone"
                    value={filters.zone}
                    onChange={handleFilterChange}
                    className="filter-select"
                >
                    <option value="">Filter by Zone (All)</option>
                    {zoneOptions.map(zone => (
                        <option key={zone} value={zone}>{zone}</option>
                    ))}
                </select>
            </div>
            
            {/* GRUPO 2: Rango de Edad y Fechas */}
            <div className="filter-group">
                <div className="filter-age-range">
                    <input
                        type="number"
                        name="ageMin"
                        placeholder="Min Age"
                        value={filters.ageMin}
                        onChange={handleFilterChange}
                        className="filter-input"
                    />
                    <input
                        type="number"
                        name="ageMax"
                        placeholder="Max Age"
                        value={filters.ageMax}
                        onChange={handleFilterChange}
                        className="filter-input"
                    />
                </div>
                
                <div className="filter-date-range">
                    <label>From:</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="filter-input"
                    />
                    <label>To:</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="filter-input"
                    />
                </div>
            </div>
            
        </div>
        

        {filteredIncidents.length > 0 ? (
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
                  <th>Actions</th>
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
                {Math.ceil(filteredIncidents.length / itemsPerPage)}
              </span>

              <button
                disabled={
                  currentPage === Math.ceil(filteredIncidents.length / itemsPerPage)
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
            {incidentes.length === 0 ? "No data available." : "No reports match the current filters."}
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

export default PersonalHistory;