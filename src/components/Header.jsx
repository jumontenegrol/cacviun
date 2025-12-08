import React, { useState } from 'react'; 
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { useSessionStore } from "./../session/sessionStore.ts";
import './../styles/Header.css';
import Logo from './Logo.jsx';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Para marcar el enlace activo
  const session = useSessionStore((state) => state.session);
  const clearSession = useSessionStore((state) => state.setSession);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = () => {
    clearSession({name: "", email: "", role: ""});
    navigate("/");
    closeMenu();
  };
  
  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'header-btn active-link' : 'header-btn';
  };
  
  const isAdmin = session.role === '1';
  const isValidator = session.role === '3';
  const isLogged = !!session.role; 

  return (
    <header className="main-header go-front">
      <Logo />

      {isLogged && (
        <button className="menu-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}></div>
        </button>
      )}

      <div className={`header-buttons ${isMenuOpen ? 'open' : ''}`}>
        
        {isLogged && (
          <Link to="/statistics" onClick={closeMenu}>
              <button className={getNavLinkClass('/statistics')}>Dashboard</button>
          </Link>
        )}

        {!isValidator && (
          <>
            <Link to="/report" onClick={closeMenu}>
              <button className={getNavLinkClass('/report')}>Make a Report</button>
            </Link>

            <Link to="/personalHistory" onClick={closeMenu}>
              <button className={getNavLinkClass('/personalHistory')}>Your Reports</button>
            </Link>
          </>
        )}
        
        {isAdmin && (
          <>
            <Link to="/adminHistory" onClick={closeMenu}>
              <button className={getNavLinkClass('/adminHistory')}>All Reports</button>
            </Link>

            <Link to="/defineAdmin" onClick={closeMenu}>
              <button className={getNavLinkClass('/defineAdmin')}>Define New Admin</button>
            </Link>
          </>
        )}

        {isValidator && (
          <Link to="/adminHistory" onClick={closeMenu}>
            <button className={getNavLinkClass('/adminHistory')}>Reports to Answer</button>
          </Link>
        )}
        

        {isLogged && (
          <button className="signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;