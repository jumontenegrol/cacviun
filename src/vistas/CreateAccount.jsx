import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/App.css";
import ConfirmCode from "../components/ConfirmCode";

function CreateAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  // Reset inputs
  const resetCampos = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // ============================================
  // 🔥 VALIDACIÓN Y ENVÍO DEL CÓDIGO
  // ============================================
  const handleSubmitRegister = async () => {
    let nombre = name.trim();
    let correo = email.trim().toLowerCase();
    let pass = password.trim();
    let pass2 = confirmPassword.trim();

    if (!nombre || !correo || !pass || !pass2) {
      toast.error("Todos los campos son obligatorios.", { theme: "colored" });
      return;
    }

    if (correo.includes(" ") || pass.includes(" ") || pass2.includes(" ")) {
      toast.error("Los campos no deben contener espacios internos.", {
        theme: "colored",
      });
      return;
    }

    const regex = /^[^\s@]+@unal\.edu\.co$/;
    if (!regex.test(correo)) {
      toast.error("El email debe ser institucional @unal.edu.co.", {
        theme: "colored",
      });
      return;
    }

    if (pass !== pass2) {
      toast.error("Las contraseñas no coinciden.", { theme: "colored" });
      return;
    }

    try {
      const body = { name: nombre, email: correo, type: "register" };
      const res = await fetch("/user/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setShowConfirm(true);
    } catch (error) {
      toast.error(error?.message || "Error enviando el código.", {
        theme: "colored",
      });
    }
  };

  const handleVerifySuccess = async () => {
    try {
      const body = {
        name: name.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role: "2",
      };

      const res = await fetch("/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Cuenta creada correctamente 🎉", { theme: "colored" });

      navigate("/");
    } catch (error) {
      toast.error(error?.message || "Error creando la cuenta.", {
        theme: "colored",
      });
    }
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
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
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

        <button className="text-link" onClick={() => navigate("/")}>
          Return to Login
        </button>
      </div>

      <ToastContainer />

      {showConfirm && (
        <ConfirmCode
          email={email}
          type="register"
          onClose={() => setShowConfirm(false)}
          onSuccess={handleVerifySuccess}
        />
      )}
    </div>
  );
}

export default CreateAccount;