import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useSessionStore } from "./../session/sessionStore.ts";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/App.css";

function Login() {
  const path = "https://cacviun-backend.onrender.com";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setSession = useSessionStore((state) => state.setSession);

  const navigate = useNavigate();

  const handleLoginClick = async () => {
    let correo = email.trim().toLowerCase();
    let pass = password.trim();

    if (!correo || !pass) {
      toast.error("All fields are required.", {
        position: "top-center",
      });
      resetCampos();
      return;
    }

    if (correo.includes(" ") || pass.includes(" ")) {
      toast.error("The fields must not contain internal spaces.", {
        position: "top-center",
      });
      resetCampos();
      return;
    }

    const regex = /^[^\s@]+@unal\.edu\.co$/;
    if (!regex.test(correo)) {
      toast.error("The email address must be institutional @unal.edu.co.", {
        position: "top-center",
      });
      resetCampos();
      return;
    }

    try {
      const body = { email: correo, password: pass };
      const res = await fetch(`${path}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        toast.error("Server error. Please try again.", {
          position: "top-center",
        });
        return;
      }
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Successful connection", {
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
      toast.error("Error connecting to the server.", {
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
        <p>Sign in to continue. Cambio de proxy</p>

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

          {/*<button type="button" className="btn-primary" onClick={handleLoginClick}>*/}
          <button type="button" className="text-link" onClick={handleLoginClick}>
            Login
          </button>
        </form>

        <div className="separator"></div>

        <button
          className="text-link"
          type="button"
          onClick={handleCreateAccountClick}
        >
          Create Account
        </button>
        <div className="separator"></div>

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
