import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/style.css";

function Navbar() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("light-mode", !isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <div className="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00e5ff" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#00e5ff" strokeWidth="1.5" strokeLinejoin="round" opacity="0.5"/>
            <path d="M2 12L12 17L22 12" stroke="#00e5ff" strokeWidth="1.5" strokeLinejoin="round" opacity="0.8"/>
          </svg>
        </div>
        <div className="logo-text-wrap">
          <span className="logo-title">SkillSight</span>
          <span className="logo-sub">AI · Wastage Detector</span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="nav-links">
        <Link to="/" className={location.pathname === "/" ? "nav-link active" : "nav-link"}>
          <span className="nav-num">01</span> Profile
        </Link>
        <Link to="/upload" className={location.pathname === "/upload" ? "nav-link active" : "nav-link"}>
          <span className="nav-num">02</span> Resume
        </Link>
      </div>

      {/* Right side: Theme Toggle + CTA */}
      <div className="navbar-right">

        {/* Theme Toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          <div className={`theme-track ${isDark ? "track-dark" : "track-light"}`}>
            <div className={`theme-thumb ${isDark ? "thumb-dark" : "thumb-light"}`}>
              {isDark ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )}
            </div>
          </div>
          <span className="theme-label">{isDark ? "Dark" : "Light"}</span>
        </button>

        {/* CTA Button */}
        <Link to="/upload" className="nav-cta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Analyze Resume
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;