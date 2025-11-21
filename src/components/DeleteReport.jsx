import React from "react";
import "../styles/DeleteReport.css";

function DeleteConfirm({ report, onClose, onConfirm }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h2>Are you sure?</h2>

        <p>
          Do you really want to delete this report?
          <br />
          This action cannot be undone.
        </p>

        <button className="danger-btn" onClick={onConfirm}>
          Yes, delete it
        </button>

        <button className="confirm-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirm;
