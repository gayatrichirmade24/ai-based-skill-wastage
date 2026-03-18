import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Homepage() {
  const { user } = useAuth();

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fff", color: "#0f172a", overflowX: "hidden" }}>
      <style>{`
        .float-badge { animation: float 3s ease-in-out infinite; }
        .float-badge-2 { animation: float 3s ease-in-out infinite; animation-delay: 1.5s; }
        .feature-card { transition: transform 0.25s, box-shadow 0.25s; position: relative; overflow: hidden; }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(37,99,235,0.12); }
        .feature-card::after { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#2563eb,#60a5fa); border-radius:20px 20px 0 0; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.8)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        .hero-text { animation: fadeUp 0.8s ease both; }
        .hero-visual { animation: fadeUp 0.8s 0.2s ease both; }
        .pulse-dot { animation: pulse 2s infinite; }
        @media(max-width:960px){
          .hero-inner { grid-template-columns: 1fr !important; padding: 110px 28px 80px !important; }
          .hero-visual-wrap { display: none !important; }
          .features-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-inner { grid-template-columns: repeat(2,1fr) !important; }
          .steps-grid { grid-template-columns: repeat(2,1fr) !important; }
          .steps-line { display: none !important; }
        }
        @media(max-width:600px){
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-inner { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={S.hero}>
        <div className="float-badge" style={{ ...S.floatBadge, top: 130, right: 60 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
          45% Skills Unused
        </div>
        <div className="float-badge-2" style={{ ...S.floatBadge, bottom: 170, right: 40 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316", flexShrink: 0 }} />
          AI-Powered Analysis
        </div>

        <div className="hero-inner" style={S.heroInner}>
          <div className="hero-text">
            <div style={S.heroBadge}>
              <span className="pulse-dot" style={{ width: 6, height: 6, background: "#4ade80", borderRadius: "50%", display: "inline-block", flexShrink: 0 }} />
              India's #1 Skill Intelligence Platform
            </div>
            <h1 style={S.heroTitle}>
              Detect <em style={{ fontStyle: "normal", color: "#fbbf24" }}>Invisible</em><br />
              Skill Wastage<br />in India
            </h1>
            <p style={S.heroSubtitle}>
              Utilize your skills effectively. Our AI analyzes your resume, identifies unused talents, and recommends the right career path tailored for the Indian job market.
            </p>
            {user ? (
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link to="/dashboard" style={S.btnPrimary}>Go to Dashboard</Link>
                <a href="#how" style={S.btnGhost}>Learn More</a>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link to="/signup" style={S.btnPrimary}>Get Started Free</Link>
                <Link to="/login" style={S.btnSecondary}>Login</Link>
                <a href="#how" style={S.btnGhost}>Learn More</a>
              </div>
            )}
          </div>

          <div className="hero-visual hero-visual-wrap" style={{ display: "flex", justifyContent: "center" }}>
            <div style={S.heroCard}>
              <div style={S.magnifyIcon}>🔍</div>
              <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>Skill Analysis Report</h3>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: 20 }}>
                Upload your resume and get a full breakdown of your skill utilization vs. wasted potential.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
                {["Python", "Machine Learning"].map(s => <span key={s} style={S.skillTag}>{s}</span>)}
                {["SQL — Unused", "React — Unused"].map(s => (
                  <span key={s} style={{ ...S.skillTag, background: "rgba(251,191,36,0.2)", borderColor: "rgba(251,191,36,0.4)", color: "#fbbf24" }}>{s}</span>
                ))}
                <span style={S.skillTag}>Data Analysis</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {[{ n: "45%", l: "Skills Used" }, { n: "55%", l: "Wasted" }, { n: "3x", l: "Growth" }].map(s => (
                  <div key={s.l} style={S.statBox}>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>{s.n}</div>
                    <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="white" style={{ display: "block", width: "100%", height: 80 }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* STATS BAND */}
      <div style={S.statsBand}>
        <div className="stats-inner" style={S.statsInner}>
          {[
            { num: "10",  suffix: "L+", label: "Profiles Analyzed" },
            { num: "68",  suffix: "%",  label: "Avg. Skill Wastage Found" },
            { num: "3.2", suffix: "x",  label: "Career Growth After Switch" },
            { num: "500", suffix: "+",  label: "Partner Employers" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
                <span style={{ color: "#fff" }}>{s.num}</span>
                <span style={{ color: "#fbbf24" }}>{s.suffix}</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", marginTop: 10 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" style={{ padding: "96px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={S.sectionTag}>Why Choose Us</div>
            <h2 style={S.sectionTitle}>Everything You Need to Grow</h2>
            <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
              From resume parsing to personalized reskilling paths — we've got your career covered.
            </p>
          </div>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {[
              { icon: "📄", title: "Resume AI Parser", desc: "Upload your PDF resume and our AI instantly extracts all your skills, experience, and qualifications accurately." },
              { icon: "📊", title: "Skill Gap Analysis", desc: "See exactly which skills are being used vs wasted — with detailed matching against current job market demand." },
              { icon: "🎯", title: "Career Suggestions", desc: "Get AI-powered recommendations for jobs that best match your full skill set, including roles you haven't considered." },
              { icon: "🚀", title: "Reskilling Roadmap", desc: "Personalized learning paths with curated courses to upskill into higher-paying roles in the Indian market." },
              { icon: "🤝", title: "Employer Connect", desc: "Get matched with 500+ hiring partners actively looking for your skill profile — direct applications, no middlemen." },
              { icon: "🔒", title: "Private & Secure", desc: "Your resume data stays private. We never share your personal information without explicit consent." },
            ].map(f => (
              <div key={f.title} className="feature-card" style={S.featureCard}>
                <div style={S.featIcon}>{f.icon}</div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: "96px 0", background: "#f8faff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={S.sectionTag}>Simple Process</div>
            <h2 style={S.sectionTitle}>How It Works</h2>
            <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.7, maxWidth: 420, margin: "0 auto" }}>
              Four simple steps to unlock your full career potential.
            </p>
          </div>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, position: "relative" }}>
            <div className="steps-line" style={{ position: "absolute", top: 34, left: "12.5%", right: "12.5%", height: 2, background: "linear-gradient(90deg,#2563eb,#60a5fa)", zIndex: 0 }} />
            {[
              { n: 1, title: "Create Account", desc: "Sign up for free in under 60 seconds using your email address." },
              { n: 2, title: "Upload Resume", desc: "Upload your PDF resume — our AI extracts all skills automatically." },
              { n: 3, title: "View Analysis", desc: "Get a detailed skill wastage report with matching and unused skill breakdown." },
              { n: 4, title: "Take Action", desc: "Follow personalized career suggestions and apply to matched employers." },
            ].map(s => (
              <div key={s.n} style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 8px" }}>
                <div style={S.stepNum}>{s.n}</div>
                <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{s.title}</h4>
                <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={{ padding: "96px 48px", background: "#fff", textAlign: "center" }}>
          <div style={S.ctaBox}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: 14, letterSpacing: "-0.03em", position: "relative", zIndex: 1 }}>
              Ready to Unlock Your Full Potential?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.65, marginBottom: 36, position: "relative", zIndex: 1 }}>
              Join over 10 lakh professionals who've discovered their true career potential with AI-powered skill analysis.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
              <Link to="/signup" style={S.btnPrimary}>Get Started Free</Link>
              <a href="#how" style={S.btnSecondary}>Learn More</a>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", color: "rgba(255,255,255,0.6)", padding: "40px 48px", textAlign: "center", fontSize: "0.85rem" }}>
        © 2026 <span style={{ color: "#fff", fontWeight: 600 }}>AI Skill Wastage Detection System</span> · Built for India's Workforce · Privacy Policy · Terms
      </footer>
    </div>
  );
}

const S = {
  hero: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a3a8f 0%, #1d4ed8 50%, #2dd4bf 100%)",
    position: "relative", overflow: "hidden",
    display: "flex", alignItems: "center",
  },
  heroInner: {
    position: "relative", zIndex: 2,
    maxWidth: 1160, margin: "0 auto", padding: "120px 48px 100px",
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center",
    width: "100%",
  },
  heroBadge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff", fontSize: "0.76rem", fontWeight: 600, letterSpacing: "0.06em",
    padding: "6px 14px", borderRadius: 20, marginBottom: 24, textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: "clamp(2.2rem,4vw,3.4rem)", fontWeight: 800, lineHeight: 1.15,
    color: "#fff", letterSpacing: "-0.03em", marginBottom: 20,
  },
  heroSubtitle: {
    fontSize: "1rem", color: "rgba(255,255,255,0.82)",
    lineHeight: 1.75, marginBottom: 36, maxWidth: 440,
  },
  heroCard: {
    background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: 24, padding: "32px 28px", backdropFilter: "blur(12px)",
    width: "100%", maxWidth: 400,
    boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
  },
  magnifyIcon: {
    width: 64, height: 64, background: "rgba(255,255,255,0.2)",
    borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 18, fontSize: 28,
  },
  skillTag: {
    background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
    color: "#fff", padding: "5px 12px", borderRadius: 20, fontSize: "0.77rem", fontWeight: 500,
  },
  statBox: {
    flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 8px", textAlign: "center",
  },
  floatBadge: {
    position: "absolute", background: "#fff", borderRadius: 12,
    padding: "10px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    display: "flex", alignItems: "center", gap: 8,
    fontSize: "0.8rem", fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", zIndex: 3,
  },
  btnPrimary: {
    background: "#f97316", color: "#fff",
    padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: "0.92rem",
    border: "none", boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
    display: "inline-block",
  },
  btnSecondary: {
    background: "rgba(255,255,255,0.15)", color: "#fff",
    padding: "13px 28px", borderRadius: 10, fontWeight: 600, fontSize: "0.92rem",
    border: "1px solid rgba(255,255,255,0.35)", display: "inline-block",
  },
  btnGhost: {
    background: "transparent", color: "#fff",
    padding: "13px 24px", borderRadius: 10, fontWeight: 600, fontSize: "0.92rem",
    border: "1px solid rgba(255,255,255,0.3)", display: "inline-block",
  },
  statsBand: {
    background: "linear-gradient(135deg, #1a3a8f, #2563eb)",
    padding: "64px 48px",
  },
  statsInner: {
    maxWidth: 1160, margin: "0 auto",
    display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40, alignItems: "center",
  },
  sectionTag: {
    display: "inline-block", background: "#eef4ff", color: "#2563eb",
    fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
    padding: "6px 16px", borderRadius: 20, marginBottom: 14,
  },
  sectionTitle: {
    fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800,
    letterSpacing: "-0.03em", color: "#0f172a", marginBottom: 12,
  },
  featureCard: {
    background: "#f8faff", borderRadius: 20, padding: "32px 26px",
    border: "1px solid #dbeafe",
  },
  featIcon: {
    width: 52, height: 52, borderRadius: 13,
    background: "linear-gradient(135deg, #2563eb, #60a5fa)",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 18, fontSize: 22,
    boxShadow: "0 6px 16px rgba(37,99,235,0.25)",
  },
  stepNum: {
    width: 70, height: 70, borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb, #60a5fa)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 18px", fontSize: "1.35rem", fontWeight: 800, color: "#fff",
    boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
    border: "4px solid #fff",
  },
  ctaBox: {
    maxWidth: 700, margin: "0 auto",
    background: "linear-gradient(135deg, #1a3a8f, #2563eb)",
    borderRadius: 28, padding: "64px 56px",
    position: "relative", overflow: "hidden",
    boxShadow: "0 32px 72px rgba(26,58,143,0.25)",
  },
};