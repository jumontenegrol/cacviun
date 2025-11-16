import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/App.css";

function LoginPrueba() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // ==================================================
  // 🔥 VALIDACIÓN LOCAL Y MANEJO DEL BOTÓN LOGIN
  // ==================================================
  const handleLoginClick = () => {
    let correo = email.trim();
    let pass = password.trim();

    if (!correo || !pass) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-center",
      });
      resetCampos();
      return;
    }

    if (correo.includes(" ") || pass.includes(" ")) {
      toast.error("Los campos no deben contener espacios internos.", {
        position: "top-center",
      });
      resetCampos();
      return;
    }

    const regex = /^[^\s@]+@unal\.edu\.co$/;
    if (!regex.test(correo)) {
      toast.error("El correo debe ser institucional @unal.edu.co.", {
        position: "top-center",
      });
      resetCampos();
      return;
    }

    toast.success("✔ Validación exitosa (sin backend).", {
      position: "top-center",
    });
    navigate("/mapPrueba");
  };

  const resetCampos = () => {
    setEmail("");
    setPassword("");
  };

  // ==================================================
  // 🔥 MANEJO BOTÓN CREATE ACCOUNT
  // ==================================================
  const handleCreateAccountClick = () => {
    navigate("/createAccount");
  };

  return (
    <div className="background">
      <div className="header">CACVi-UN</div>

      <div className="login-box">
        <h1>Login</h1>
        <p>Sign in to continue</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="button" onClick={handleLoginClick}>
            Login
          </button>
        </form>

        <div className="separator">Or</div>

        <button
          className="secondary"
          type="button"
          onClick={handleCreateAccountClick}
        >
          Create Account
        </button>
      </div>

      {/* Contenedor global de Toastify */}
      <ToastContainer />
    </div>
  );
}

export default LoginPrueba;
