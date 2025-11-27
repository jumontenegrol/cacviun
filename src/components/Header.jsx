import { Link, useNavigate } from "react-router-dom";
import { useSessionStore } from "./../session/sessionStore.ts";

const Header = () => {
  const navigate = useNavigate();
  const session = useSessionStore((state) => state.session);
  const clearSession = useSessionStore((state) => state.setSession);

  const handleSignOut = () => {
    clearSession({name: "", email: "", role: ""});
    navigate("/");
  };

  return (
    <header className="report-header go-front">
      <div className="header-buttons">

        {session.role && (
          <>
            <Link to="/statistics">
              <button className="header-btn">Dashboard</button>
            </Link>

            <Link to="/personalHistory">
              <button className="header-btn">Your Reports</button>
            </Link>

            <Link to="/report">
              <button className="header-btn">Make a report</button>
            </Link>
          </>
        )}
        

        {session.role === "1" && (
          <>
            <Link to="/adminHistory">
            <button className="header-btn">All Reports</button>
            </Link>

            <Link to="/defineAdmin">
              <button className="header-btn">Define New Admin</button>
            </Link>
          </>
        )}
        

        <button className="header-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <div className="logo-wrapper">
        <span className="logo">CACVi-UN</span>
      </div>
    </header>
  );
};

export default Header;
