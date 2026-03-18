import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);

  // On homepage the hero is full-bleed gradient, use glass nav
  // On all other pages, use a solid white nav so it's readable
  const isHome = location.pathname === "/" || location.pathname === "/home";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setDropOpen(false);
  };

  const initial = user ? (user.displayName || user.email || "U")[0].toUpperCase() : "U";
  const firstName = user
    ? user.displayName ? user.displayName.split(" ")[0] : user.email.split("@")[0]
    : "";

  const isActive = (path) =>
    path === "/home" || path === "/"
      ? location.pathname === "/" || location.pathname === "/home"
      : location.pathname === path;

  return (
    <>
      <style>{`
        .nav-link-item:hover { opacity: 1 !important; }
        .nav-cta-btn:hover { background: #1d4ed8 !important; transform: translateY(-1px); }
        .drop-item:hover { background: #f8faff !important; }
        .user-pill-wrap:hover .user-pill { background: ${isHome ? "rgba(255,255,255,0.25)" : "#f1f5f9"} !important; }
      `}</style>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px",
        // Solid white on inner pages, glass on homepage
        background: isHome
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.98)",
        backdropFilter: "blur(20px)",
        borderBottom: isHome
          ? "1px solid rgba(255,255,255,0.15)"
          : "1px solid #e2e8f0",
        boxShadow: isHome ? "none" : "0 1px 12px rgba(0,0,0,0.07)",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}>

        {/* Logo */}
        <Link to={user ? "/home" : "/"} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: isHome ? "#fff" : "linear-gradient(135deg,#2563eb,#3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: isHome ? "none" : "0 4px 12px rgba(37,99,235,0.3)",
          }}>
            <svg viewBox="0 0 24 24" fill="none"
              stroke={isHome ? "#2563eb" : "#fff"}
              strokeWidth="2.5" strokeLinecap="round" width="18" height="18">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <span style={{
            fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.02em",
            color: isHome ? "#fff" : "#0f172a",
          }}>
            AI Skill Wastage
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {user ? (
            <>
              {[
                { to: "/home",      label: "Home"      },
                { to: "/profile",   label: "Profile"   },
                { to: "/upload",    label: "Resume"    },
                { to: "/dashboard", label: "Dashboard" },
              ].map(({ to, label }) => {
                const active = isActive(to);
                return (
                  <Link key={to} to={to} className="nav-link-item" style={{
                    padding: "8px 16px", borderRadius: 8,
                    fontSize: "0.88rem", fontWeight: active ? 700 : 500,
                    textDecoration: "none",
                    color: isHome
                      ? active ? "#fff" : "rgba(255,255,255,0.8)"
                      : active ? "#2563eb" : "#475569",
                    background: !isHome && active ? "#eff6ff" : "transparent",
                    transition: "all 0.15s",
                    opacity: 1,
                  }}>
                    {label}
                  </Link>
                );
              })}
            </>
          ) : (
            <>
              <a href="#how" className="nav-link-item" style={{ padding: "8px 16px", borderRadius: 8, fontSize: "0.88rem", fontWeight: 500, color: isHome ? "rgba(255,255,255,0.85)" : "#475569", textDecoration: "none" }}>How It Works</a>
              <a href="#features" className="nav-link-item" style={{ padding: "8px 16px", borderRadius: 8, fontSize: "0.88rem", fontWeight: 500, color: isHome ? "rgba(255,255,255,0.85)" : "#475569", textDecoration: "none" }}>Features</a>
              <Link to="/login" className="nav-link-item" style={{ padding: "8px 16px", borderRadius: 8, fontSize: "0.88rem", fontWeight: 500, color: isHome ? "rgba(255,255,255,0.85)" : "#475569", textDecoration: "none" }}>Login</Link>
              <Link to="/signup" className="nav-cta-btn" style={{ padding: "9px 20px", borderRadius: 9, fontSize: "0.88rem", fontWeight: 700, color: "#fff", background: "#2563eb", textDecoration: "none", marginLeft: 4, transition: "all 0.2s" }}>Sign Up</Link>
            </>
          )}
        </div>

        {/* User Pill */}
        {user && (
          <div className="user-pill-wrap" style={{ position: "relative" }} onMouseLeave={() => setDropOpen(false)}>
            <div
              style={{
                display: "flex", alignItems: "center", gap: 9, cursor: "pointer",
                padding: "6px 14px 6px 6px", borderRadius: 40,
                background: isHome ? "rgba(255,255,255,0.15)" : "#f8faff",
                border: isHome ? "1px solid rgba(255,255,255,0.25)" : "1px solid #e2e8f0",
                transition: "background 0.2s",
                userSelect: "none",
              }}
              onClick={() => setDropOpen(p => !p)}
            >
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg,#fbbf24,#f97316)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", flexShrink: 0,
              }}>
                {user.photoURL
                  ? <img src={user.photoURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 800 }}>{initial}</span>
                }
              </div>
              <span style={{ fontSize: "0.86rem", fontWeight: 600, color: isHome ? "#fff" : "#0f172a" }}>{firstName}</span>
              <span style={{ fontSize: "0.65rem", color: isHome ? "rgba(255,255,255,0.6)" : "#94a3b8" }}>▼</span>
            </div>

            {dropOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "#fff", borderRadius: 14, minWidth: 210,
                boxShadow: "0 16px 48px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0",
                overflow: "hidden", zIndex: 300,
              }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>{user.displayName || firstName}</p>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "2px 0 0" }}>{user.email}</p>
                </div>
                {[
                  { to: "/profile",   icon: "👤", label: "My Profile"  },
                  { to: "/dashboard", icon: "📊", label: "Dashboard"   },
                  { to: "/upload",    icon: "📄", label: "Upload Resume"},
                ].map(({ to, icon, label }) => (
                  <Link key={to} to={to} className="drop-item" onClick={() => setDropOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", fontSize: "0.86rem", fontWeight: 500, color: "#334155", textDecoration: "none", transition: "background 0.15s" }}>
                    <span>{icon}</span>{label}
                  </Link>
                ))}
                <div style={{ height: 1, background: "#f1f5f9" }} />
                <button onClick={handleLogout}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", width: "100%", fontSize: "0.86rem", fontWeight: 500, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
                  className="drop-item">
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}