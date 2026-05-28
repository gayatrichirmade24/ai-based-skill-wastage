import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { registerWithEmail, registerWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [terms, setTerms] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [strength, setStrength] = useState(0);

  const showMsg = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const friendlyError = (code) => {
    const map = {
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password is too weak. Use at least 8 characters.",
      "auth/popup-closed-by-user": "Google sign-up was cancelled.",
    };
    return map[code] || "Something went wrong. Please try again.";
  };

  const checkStrength = (val) => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm) { showMsg("Please fill in all fields."); return; }
    if (form.password.length < 8) { showMsg("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { showMsg("Passwords do not match."); return; }
    if (!terms) { showMsg("Please accept the Terms & Conditions."); return; }
    setLoading(true);
    try {
      await registerWithEmail(form.name, form.email, form.password);
      showMsg("Account created! Redirecting...", "success");
      setTimeout(() => navigate("/home"), 1200);
    } catch (e) {
      setLoading(false);
      showMsg(friendlyError(e.code));
    }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      const r = await registerWithGoogle();
      showMsg("Welcome, " + r.user.displayName + "!", "success");
      setTimeout(() => navigate("/home"), 1000);
    } catch (e) {
      setGLoading(false);
      showMsg(friendlyError(e.code));
    }
  };

  const strengthColors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong 💪"];

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .signup-card{animation:fadeUp 0.6s ease both;}
        .google-btn:hover{border-color:#3b82f6!important;background:#f8faff!important;transform:translateY(-1px);}
        .signup-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(37,99,235,0.45)!important;}
        input:focus{border-color:#2563eb!important;box-shadow:0 0 0 3px rgba(37,99,235,0.1)!important;background:#fff!important;outline:none;}
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
        <h1 style={S.leftH1}>Start Your <em style={{ fontStyle: "normal", color: "#fbbf24" }}>Journey</em><br/>to Better Career</h1>
        <p style={S.leftP}>Create a free account and discover how much of your potential is going unused — in just minutes.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative", zIndex: 1 }}>
          {[
            { n: "1", t: "Create Your Account", d: "Quick sign-up with email or Google — completely free." },
            { n: "2", t: "Complete Your Profile", d: "Tell us about your education, skills and current job role." },
            { n: "3", t: "Upload Your Resume", d: "Our AI scans your resume for a detailed skill analysis." },
            { n: "4", t: "Get Recommendations", d: "Receive career suggestions and reskilling paths instantly." },
          ].map((s, i) => (
            <div key={s.n} style={{ display: "flex", alignItems: "flex-start", gap: 14, paddingBottom: i < 3 ? 22 : 0, position: "relative" }}>
              {i < 3 && <div style={{ position: "absolute", left: 19, top: 42, width: 2, height: "calc(100% - 24px)", background: "rgba(255,255,255,0.2)" }} />}
              <div style={S.stepNum}>{s.n}</div>
              <div>
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff", marginBottom: 3 }}>{s.t}</h4>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={S.right}>
        <div className="signup-card" style={S.card}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={S.iconCircle}>✨</div>
            <h2 style={S.cardH2}>Create Account</h2>
            <p style={{ color: "#64748b", fontSize: "0.88rem" }}>Join 10 lakh+ professionals today</p>
          </div>

          {/* Google */}
          <button className="google-btn" onClick={handleGoogle} disabled={gLoading} style={S.googleBtn}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {gLoading ? "Signing up..." : "Sign up with Google"}
          </button>

          <div style={S.divider}><span style={S.dividerLine}/><span style={{ color: "#64748b", fontSize: "0.8rem", padding: "0 12px" }}>or create account with email</span><span style={S.dividerLine}/></div>

          {/* Name */}
          <div style={S.field}>
            <label style={S.label}>Full Name</label>
            <div style={{ position: "relative" }}>
              <span style={S.ficon}>👤</span>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Rahul Sharma" style={S.input} />
            </div>
          </div>

          {/* Email */}
          <div style={S.field}>
            <label style={S.label}>Email Address</label>
            <div style={{ position: "relative" }}>
              <span style={S.ficon}>✉️</span>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" style={S.input} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Password */}
            <div style={S.field}>
              <label style={S.label}>Password</label>
              <div style={{ position: "relative" }}>
                <span style={S.ficon}>🔒</span>
                <input type={showPass ? "text" : "password"} value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); checkStrength(e.target.value); }}
                  placeholder="Min. 8 chars" style={S.input} />
                <button onClick={() => setShowPass(p => !p)} style={S.togglePass}>{showPass ? "🙈" : "👁️"}</button>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 7 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < strength ? strengthColors[Math.min(strength-1,3)] : "#dbeafe", transition: "background 0.3s" }} />
                ))}
              </div>
              {form.password && <div style={{ fontSize: "0.72rem", marginTop: 4, color: strengthColors[Math.min(strength-1,3)] }}>Password strength: {strengthLabels[Math.min(strength-1,0)]}</div>}
            </div>

            {/* Confirm */}
            <div style={S.field}>
              <label style={S.label}>Confirm</label>
              <div style={{ position: "relative" }}>
                <span style={S.ficon}>🛡️</span>
                <input type={showConf ? "text" : "password"} value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  placeholder="Repeat" style={S.input} />
                <button onClick={() => setShowConf(p => !p)} style={S.togglePass}>{showConf ? "🙈" : "👁️"}</button>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, fontSize: "0.82rem", color: "#64748b", lineHeight: 1.5 }}>
            <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)}
              style={{ width: 16, height: 16, marginTop: 2, accentColor: "#2563eb", cursor: "pointer" }} />
            <label>
              I agree to the <a href="#" style={{ color: "#2563eb", fontWeight: 600 }}>Terms of Service</a> and <a href="#" style={{ color: "#2563eb", fontWeight: 600 }}>Privacy Policy</a>
            </label>
          </div>

          <button className="signup-btn" onClick={handleRegister} disabled={loading} style={S.signupBtn}>
            {loading ? "Creating Account..." : "Create My Account"}
          </button>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.88rem", color: "#64748b" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563eb", fontWeight: 700 }}>Log In</Link>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 999,
          padding: "14px 22px", borderRadius: 12, fontSize: "0.88rem", fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          background: toast.type === "success" ? "#dcfce7" : "#fee2e2",
          color: toast.type === "success" ? "#16a34a" : "#dc2626",
          border: `1px solid ${toast.type === "success" ? "#86efac" : "#fca5a5"}`,
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
    width: "44%", background: "linear-gradient(145deg,#1a3a8f 0%,#2563eb 55%,#0ea5e9 100%)",
    display: "flex", flexDirection: "column", justifyContent: "center",
    padding: "64px 56px", position: "relative", overflow: "hidden",
  },
  leftLogo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 48, color: "#fff", fontWeight: 800, fontSize: "1rem" },
  logoBox: { width: 36, height: 36, background: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
  leftH1: { fontSize: "2.2rem", fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 14 },
  leftP: { color: "rgba(255,255,255,0.75)", fontSize: "0.97rem", lineHeight: 1.7, marginBottom: 36, maxWidth: 320 },
  stepNum: { width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 800, color: "#fff" },
  right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 36px", overflowY: "auto" },
  card: { width: "100%", maxWidth: 440, background: "#fff", borderRadius: 24, padding: "44px 42px", boxShadow: "0 20px 60px rgba(37,99,235,0.1)", border: "1px solid #dbeafe" },
  iconCircle: { width: 62, height: 62, borderRadius: 18, background: "linear-gradient(135deg,#2563eb,#60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26, boxShadow: "0 8px 24px rgba(37,99,235,0.3)" },
  cardH2: { fontSize: "1.65rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 5 },
  googleBtn: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#fff", border: "1.5px solid #dbeafe", borderRadius: 12, padding: 12, fontWeight: 600, fontSize: "0.9rem", color: "#0f172a", cursor: "pointer", marginBottom: 22, transition: "all 0.2s" },
  divider: { display: "flex", alignItems: "center", marginBottom: 22 },
  dividerLine: { flex: 1, height: 1, background: "#dbeafe", display: "block" },
  field: { marginBottom: 17 },
  label: { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#0f172a", marginBottom: 6 },
  ficon: { position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: "0.85rem" },
  input: { width: "100%", padding: "12px 12px 12px 40px", border: "1.5px solid #dbeafe", borderRadius: 11, fontFamily: "inherit", fontSize: "0.9rem", color: "#0f172a", background: "#eef4ff", transition: "all 0.2s" },
  togglePass: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem" },
  signupBtn: { width: "100%", padding: 14, borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", fontSize: "1rem", fontWeight: 700, boxShadow: "0 6px 20px rgba(37,99,235,0.35)", transition: "all 0.2s" },
};