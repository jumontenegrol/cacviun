import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/App.css";
import ConfirmCode from "../components/ConfirmCode";
import Logo from "../components/Logo";

function ForgotPassword() {
  const path = "https://cacviun-backend.onrender.com";
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

  const handleSubmitRegister = async () => {
    let correo = email.trim().toLowerCase();
    let pass = password.trim();
    let pass2 = confirmPassword.trim();

    if (!correo || !pass || !pass2) {
      toast.error("All fields are required.", { theme: "colored" });
      resetCampos();
      return;
    }

    if (correo.includes(" ") || pass.includes(" ") || pass2.includes(" ")) {
      toast.error("The fields must not contain internal spaces.", {
        theme: "colored",
      });
      resetCampos();
      return;
    }

    const regex = /^[^\s@]+@unal\.edu\.co$/;
    if (!regex.test(correo)) {
      toast.error("The email address must be institutional @unal.edu.co.", {
        theme: "colored",
      });
      resetCampos();
      return;
    }

    if (pass !== pass2) {
      toast.error("The passwords do not match.", { theme: "colored" });
      return;
    }

    // Para forgotPassword: el correo DEBE existir
    try{
      const res = await fetch(`${path}/user/exist-email/${email}`);
      const data = await res.json();
      if (data.exist === false) {
        toast.error("The email address does not exist in the system.", { theme: "colored" });
        resetCampos();
        return;
      }
    } catch(error){
      toast.error("Error connecting to the server.", {
        position: "top-center",
      });
    }

    try {
      setShowConfirm(true);

      const body = { email: correo, type: "forgot" };
      const res = await fetch(`${path}/user/send-verification-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error?.message || "Error sending code.", {
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

      const res = await fetch(`${path}/user/reset-password`, {
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
      toast.error(error?.message || "Error updating password.", {
        theme: "colored",
      });
    }
  };

  return (
    <div className="background">
      <div className="header"><Logo /></div>

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

          <button type="button" className="btn-primary" onClick={handleSubmitRegister}>
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
