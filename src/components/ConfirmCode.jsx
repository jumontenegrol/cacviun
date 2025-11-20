import React, { useState } from "react";
import "./../styles/ConfirmCode.css";
import { toast } from "react-toastify";

function ConfirmCode({ email, type, onClose, onSuccess }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) return;

    setLoading(true);

    try {
      const body = {
        email: email.toLowerCase(),
        code: code.trim(),
        type: type,
      };

      const res = await fetch("/user/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data || !data.success) {
        throw new Error(data?.message || "Error verifying code");
      }

      // Notificar a la vista principal
      onSuccess && onSuccess();

      // Cerrar modal
      handleClose();
    } catch (error) {
      toast.error(error?.message || "Error validating code", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    onClose && onClose();
  };

  return (
    <div className="confirm-overlay">
      <div className="confirm-box" role="dialog" aria-modal="true">
        <h2>Confirm Your Email</h2>

        <p className="confirm-subtitle">
          We sent a verification code to:
          <br />
          <strong>{email}</strong>
        </p>

        <label>Verification Code</label>
        <input
          type="text"
          placeholder="Enter the code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleVerify(); }}
        />

        <button onClick={handleVerify} disabled={loading || !code.trim()}>
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button className="confirm-cancel" onClick={handleClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ConfirmCode;
