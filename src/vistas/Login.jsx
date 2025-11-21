import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useSessionStore } from "./../session/sessionStore.ts";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setSession = useSessionStore((state) => state.setSession);

  const navigate = useNavigate();

  // ==================================================
  // 🔥 VALIDACIÓN LOCAL Y MANEJO DEL BOTÓN LOGIN
  // ==================================================
  const handleLoginClick = async () => {
    let correo = email.trim().toLowerCase();
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

    try {
      const body = { email: correo, password: pass };
      const res = await fetch("user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        toast.error("Error del servidor. Intenta de nuevo.", {
          position: "top-center",
        });
        return;
      }
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Conexión exitosa", {
          position: "top-center",
        });
        console.log(data.session);
        setSession(data.session);
        navigate("/map");
      } else {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Error conectando con el servidor.", {
        position: "top-center",
      });
    }
  };

  const resetCampos = () => {
    setEmail("");
    setPassword("");
  };

  const handleCreateAccountClick = () => {
    navigate("/createAccount");
  };

  const handleForgotPasswordClick = () => {
    navigate("/forgotPassword");
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
          className="text-link"
          type="button"
          onClick={handleCreateAccountClick}
        >
          Create Account
        </button>

        {/* 🟦 NUEVO BOTÓN FORGOT PASSWORD */}
        <button
          className="text-link"
          type="button"
          onClick={handleForgotPasswordClick}
        >
          Forgot Password?
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
