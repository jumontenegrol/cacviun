import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/App.css";

function CreateAccountPrueba() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // ==================================================
  // 🔥 VALIDACIÓN Y MANEJO DEL BOTÓN SUBMIT
  // ==================================================
  const handleSubmitRegister = () => {
    let nombre = name.trim();
    let correo = email.trim();
    let pass = password.trim();
    let pass2 = confirmPassword.trim();

    // Validar campos vacíos
    if (!nombre || !correo || !pass || !pass2) {
      toast.error("Todos los campos son obligatorios.", { theme: "colored" });
      resetCampos();
      return;
    }

    // No permitir espacios internos
    if (
      correo.includes(" ") ||
      pass.includes(" ") ||
      pass2.includes(" ")
    ) {
      toast.error("Los campos no deben contener espacios internos.", {
        theme: "colored",
      });
      resetCampos();
      return;
    }

    // Email institucional
    const regex = /^[^\s@]+@unal\.edu\.co$/;
    if (!regex.test(correo)) {
      toast.error("El email debe ser institucional @unal.edu.co.", {
        theme: "colored",
      });
      resetCampos();
      return;
    }

    // Passwords iguales
    if (pass !== pass2) {
      toast.error("Las contraseñas no coinciden.", { theme: "colored" });
      resetCampos();
      return;
    }

    // ✔ Todo correcto
    toast.success("Cuenta creada exitosamente", { theme: "colored" });

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const resetCampos = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // ==================================================
  // 🔥 FUNCIÓN BOTÓN RETURN TO LOGIN
  // ==================================================
  const handleReturnLoginClick = () => {
    navigate("/");
  };

  return (
    <div className="background">
      <div className="header">CACVi-UN</div>

      <div className="login-box">
        <h1>Create New Account</h1>

        <form onSubmit={(e) => e.preventDefault()}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email @unal.edu.co</label>
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* 🔥 NUEVO CAMPO CONFIRM PASSWORD */}
          <label>Confirm Password</label>
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

        <div className="separator">Already Registered?</div>

        <button
          className="secondary"
          type="button"
          onClick={handleReturnLoginClick}
        >
          Return to Login
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default CreateAccountPrueba;
