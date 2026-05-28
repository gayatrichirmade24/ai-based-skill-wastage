import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { loginWithEmail, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showMsg = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const friendlyError = (code) => {
    const map = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password. Try again.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/popup-closed-by-user": "Google sign-in was cancelled.",
      "auth/invalid-credential": "Incorrect email or password.",
    };
    return map[code] || "Something went wrong. Please try again.";
  };

  const handleLogin = async () => {
    if (!email || !password) { showMsg("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      showMsg("Welcome back!", "success");
      setTimeout(() => navigate("/home"), 800);
    } catch (e) {
      setLoading(false);
      showMsg(friendlyError(e.code));
    }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      const r = await loginWithGoogle();
      showMsg("Welcome, " + r.user.displayName + "!", "success");
      setTimeout(() => navigate("/home"), 800);
    } catch (e) {
      setGLoading(false);
      showMsg(friendlyError(e.code));
    }
  };

  const handleForgot = async () => {
    if (!email) { showMsg("Enter your email above first."); return; }
    try {
      await resetPassword(email);
      showMsg("Password reset email sent!", "success");
    } catch (e) {
      showMsg(friendlyError(e.code));
    }
  };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .feat-item{animation:fadeUp 0.7s ease both;}
        .feat-item:nth-child(2){animation-delay:.1s}
        .feat-item:nth-child(3){animation-delay:.2s}
        .login-card{animation:fadeUp 0.6s ease both;}
        .google-btn:hover{border-color:#3b82f6!important;background:#f8faff!important;transform:translateY(-1px);}
        .login-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(37,99,235,0.45)!important;}
        input:focus{border-color:#2563eb!important;box-shadow:0 0 0 3px rgba(37,99,235,0.12)!important;background:#fff!important;outline:none;}
      `}</style>

      {/* LEFT */}
      <div style={S.left}>
        <Link to="/" style={S.leftLogo}>
          <div style={S.logoBox}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" width="22" height="22">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          AI Skill Wastage Detection
        </Link>
        <h1 style={S.leftH1}>Welcome <em style={{ fontStyle: "normal", color: "#fbbf24" }}>Back!</em><br/>Great to See You</h1>
        <p style={S.leftP}>Log in to access your personalized skill analysis, career recommendations, and reskilling roadmap.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative", zIndex: 1 }}>
          {[
            { icon: "📊", text: "View your complete skill analysis report" },
            { icon: "🎯", text: "Get AI-powered career suggestions" },
            { icon: "🚀", text: "Track your reskilling progress" },
          ].map(f => (
            <div key={f.text} className="feat-item" style={S.featItem}>
              <span style={{ fontSize: "1.4rem" }}>{f.icon}</span>
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.88rem", fontWeight: 500 }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={S.right}>
        <div className="login-card" style={S.card}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={S.iconCircle}>🔐</div>
            <h2 style={S.cardH2}>Sign In</h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Enter your credentials to continue</p>
          </div>

          {/* Google */}
          <button className="google-btn" onClick={handleGoogle} disabled={gLoading} style={S.googleBtn}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {gLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <div style={S.divider}><span style={S.dividerLine}/><span style={{ color: "#64748b", fontSize: "0.82rem", padding: "0 12px" }}>or sign in with email</span><span style={S.dividerLine}/></div>

          {/* Email */}
          <div style={S.field}>
            <label style={S.label}>Email Address</label>
            <div style={{ position: "relative" }}>
              <span style={S.ficon}>✉️</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" style={S.input}
                onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
          </div>

          {/* Password */}
          <div style={S.field}>
            <label style={S.label}>Password</label>
            <div style={{ position: "relative" }}>
              <span style={S.ficon}>🔑</span>
              <input type={showPass ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" style={S.input}
                onKeyDown={e => e.key === "Enter" && handleLogin()} />
              <button onClick={() => setShowPass(p => !p)} style={S.togglePass}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <button onClick={handleForgot} style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.82rem", fontWeight: 500, cursor: "pointer" }}>
              Forgot Password?
            </button>
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={loading} style={S.loginBtn}>
            {loading ? "Signing in..." : "Log In"}
          </button>

          <div style={{ textAlign: "center", marginTop: 24, fontSize: "0.88rem", color: "#64748b" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#2563eb", fontWeight: 700 }}>Sign Up Free</Link>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 999,
          padding: "14px 22px", borderRadius: 12, fontSize: "0.88rem", fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          background: toast.type === "success" ? "#dcfce7" : "#fee2e2",
          color: toast.type === "success" ? "#16a34a" : "#dc2626",
          border: `1px solid ${toast.type === "success" ? "#86efac" : "#fca5a5"}`,
          animation: "fadeUp 0.35s ease",
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

const S = {
  page: { minHeight: "100vh", display: "flex", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#eef4ff" },
  left: {
    width: "48%", background: "linear-gradient(145deg,#1a3a8f 0%,#2563eb 55%,#2dd4bf 100%)",
    display: "flex", flexDirection: "column", justifyContent: "center",
    padding: "64px 60px", position: "relative", overflow: "hidden",
  },
  leftLogo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 56, color: "#fff", fontWeight: 800, fontSize: "1rem" },
  logoBox: { width: 36, height: 36, background: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
  leftH1: { fontSize: "2.4rem", fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 16 },
  leftP: { color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.7, marginBottom: 40, maxWidth: 340 },
  featItem: {
    display: "flex", alignItems: "center", gap: 14,
    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 14, padding: "14px 18px", backdropFilter: "blur(8px)", marginBottom: 12,
  },
  right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 40px", overflowY: "auto" },
  card: { width: "100%", maxWidth: 420, background: "#fff", borderRadius: 24, padding: "48px 44px", boxShadow: "0 20px 60px rgba(37,99,235,0.1)", border: "1px solid #dbeafe" },
  iconCircle: { width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#2563eb,#60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 28, boxShadow: "0 8px 24px rgba(37,99,235,0.3)" },
  cardH2: { fontSize: "1.7rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 6 },
  googleBtn: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#fff", border: "1.5px solid #dbeafe", borderRadius: 12, padding: 13, fontWeight: 600, fontSize: "0.92rem", color: "#0f172a", cursor: "pointer", marginBottom: 24, transition: "all 0.2s" },
  divider: { display: "flex", alignItems: "center", marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, background: "#dbeafe", display: "block" },
  field: { marginBottom: 20 },
  label: { display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#0f172a", marginBottom: 7 },
  ficon: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: "0.9rem" },
  input: { width: "100%", padding: "13px 14px 13px 42px", border: "1.5px solid #dbeafe", borderRadius: 12, fontFamily: "inherit", fontSize: "0.92rem", color: "#0f172a", background: "#eef4ff", transition: "all 0.2s" },
  togglePass: { position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" },
  loginBtn: { width: "100%", padding: 14, borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", fontSize: "1rem", fontWeight: 700, boxShadow: "0 6px 20px rgba(37,99,235,0.35)", transition: "all 0.2s" },
};