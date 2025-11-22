import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "./../styles/Statistics.css";
import { ToastContainer, toast } from "react-toastify";
import DeleteConfirm from "../components/DeleteReport";
import EditReport from "../components/EditReport";
import { useSessionStore } from "./../session/sessionStore.ts";


function extractId(report) {
  if (!report) return null;
  if (report._id && typeof report._id === "string") return report._id;
  if (report._id && report._id.$oid) return report._id.$oid;
  if (report._id && report._id.toString) return report._id.toString();
  if (report.id) return report.id;
  return null;
}

function PersonalStatistics() {
  const session = useSessionStore((state) => state.session);

  const [incidentes, setIncidentes] = useState([]);

 
  const fetchHistory = async () => {
    try {
      const res = await fetch(`/report/history/${session.email}`);

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
  }, [session.email]);

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

      const res = await fetch(`/report/delete/${id}`, {
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
        category: editedData.category, // string legible
        description: editedData.description,
      };

      const res = await fetch(`/report/edit/${id}`, {
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

        {/* Tabla */}
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
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {incidentes.map((inc, index) => (
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
