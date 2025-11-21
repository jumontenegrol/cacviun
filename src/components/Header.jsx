import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <header className="report-header go-front">
      <div className="header-buttons">

        <Link to="/personalStatistics">
          <button className="header-btn">See your statistics</button>
        </Link>

        <Link to="/report">
          <button className="header-btn">Make a report</button>
        </Link>

        <Link to="/map">
          <button className="header-btn">See the map</button>
        </Link>

        <Link to="/defineAdmin">
          <button className="header-btn">Define New Admin</button>
        </Link>

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
