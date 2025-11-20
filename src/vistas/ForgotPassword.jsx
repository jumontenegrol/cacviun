import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/App.css";
import ConfirmCode from "../components/ConfirmCode";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  // Reset inputs
  const resetCampos = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // ============================================
  // 🔥 VALIDACIÓN Y ENVÍO DEL CÓDIGO
  // ============================================
  const handleSubmitRegister = async () => {
    let correo = email.trim().toLowerCase();
    let pass = password.trim();
    let pass2 = confirmPassword.trim();

    if (!correo || !pass || !pass2) {
      toast.error("Todos los campos son obligatorios.", { theme: "colored" });
      resetCampos();
      return;
    }

    if (correo.includes(" ") || pass.includes(" ") || pass2.includes(" ")) {
      toast.error("Los campos no deben contener espacios internos.", {
        theme: "colored",
      });
      resetCampos();
      return;
    }

    const regex = /^[^\s@]+@unal\.edu\.co$/;
    if (!regex.test(correo)) {
      toast.error("El email debe ser institucional @unal.edu.co.", {
        theme: "colored",
      });
      resetCampos();
      return;
    }

    if (pass !== pass2) {
      toast.error("Las contraseñas no coinciden.", { theme: "colored" });
      return;
    }

    // Para forgotPassword: el correo DEBE existir
    const res = await fetch(`/user/exist-email/${correo}`);
    const data = await res.json();
    if (data.exist === false) {
      toast.error("El correo no existe en el sistema", { theme: "colored" });
      resetCampos();
      return;
    }

    try {
      setShowConfirm(true);

      const body = { email: correo, type: "forgot" };
      const res = await fetch("/user/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error?.message || "Error enviando el código.", {
        theme: "colored",
      });
      resetCampos();
    }
  };

  const handleVerifySuccess = async () => {
    try {
      const body = {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      };

      const res = await fetch("/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success( data.message, {
        theme: "colored",
      });

      navigate("/");
    } catch (error) {
      toast.error(error?.message || "Error actualizando la contraseña.", {
        theme: "colored",
      });
    }
  };

  return (
    <div className="background">
      <div className="header">CACVi-UN</div>

      <div className="login-box">
        <h1>Recover Password</h1>

        <form onSubmit={(e) => e.preventDefault()}>
          <label>Email @unal.edu.co</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            required
          />

          <label>New Password</label>
          <input
            type="password"
            placeholder="Create a new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="button" onClick={handleSubmitRegister}>
            Submit
          </button>
        </form>

        <div className="separator">Remember your password?</div>

        <button className="text-link" onClick={() => navigate("/")}>
          Return to Login
        </button>
      </div>

      <ToastContainer />

      {showConfirm && (
        <ConfirmCode
          email={email}
          type="forgot"
          onClose={() => setShowConfirm(false)}
          onSuccess={handleVerifySuccess}
        />
      )}
    </div>
  );
}

export default ForgotPassword;
