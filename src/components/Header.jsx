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
            <Link to="/map">
              <button className="header-btn">See the map</button>
            </Link>

            <Link to="/personalStatistics">
              <button className="header-btn">See your statistics</button>
            </Link>

            <Link to="/report">
              <button className="header-btn">Make a report</button>
            </Link>
          </>
        )}
        

        {session.role === "1" && (
          <>
            <Link to="/adminStatistics">
            <button className="header-btn">Admin Statistics</button>
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
