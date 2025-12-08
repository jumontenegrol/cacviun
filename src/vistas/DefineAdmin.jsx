import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/Report.css";
import Header from "../components/Header";
import Hero from "../components/Hero";

function Report() {
  const path = "https://cacviun-backend.onrender.com";
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let correo = email;

    if (!email.trim()) {
      toast.error("Email field required", { position: "top-center" });
      return;
    }

    // Email institucional obligatorio
    const emailRegex = /^[^\s@]+@unal\.edu\.co$/;
    if (!emailRegex.test(email)) {
      toast.error("Email must be @unal.edu.co", { position: "top-center" });
      return;
    }

    try{
      const res = await fetch(`${path}/user/exist-email/${email}`);
      const data = await res.json();
      if (data.exist === false) {
        toast.error("The email address does not exist in the system.", { theme: "colored" });
        setEmail("");
        return;
      }
    } catch(error){
      toast.error("Error connecting to the server.", {
        position: "top-center",
      });
    }

    try{
      const body = {email: correo};
      const res = await fetch(`${path}/user/define-admin`,{
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
      if(data.success){
        toast.success("Administrator successfully assigned", {
          position: "top-center",
          autoClose: 2000,
        });
      }else{
        toast.error(data.message, {
          position: "top-center",
        });
      }
    } catch (error){
      console.log(error);
      toast.error("Error connecting to the server.", {
        position: "top-center",
      });
    }

    

    setEmail("");
  };

  return (
    <div className="report-container">
      <Header />

      <div className="report-content">
        <div className="form-header-text">
          <h1 className="form-title">Define New Admintrator</h1>
          <p className="form-subtitle">Please enter the email that you want assign as an admin</p>
        </div>

        <form onSubmit={handleSubmit} className="report-form-single-column">

          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              placeholder="Enter the email with @unal.edu.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn">
            ASSIGN AS ADMIN
          </button>
        </form>

      </div>
        <Hero />
        <ToastContainer />

    </div>
  );
}

export default Report;
