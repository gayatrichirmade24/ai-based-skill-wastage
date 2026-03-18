import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
// PHASE 1: Mock analysis — no API calls at all
// Phase 2: swap generateMockReport() with real
//          Anthropic API call, nothing else changes
// ─────────────────────────────────────────────

const STEPS = ["Upload", "Parsing", "Analyzing", "Results"];

const ROLE_POOL = {
  design:   ["UI/UX Designer", "Product Designer", "Visual Designer", "Interaction Designer"],
  frontend: ["Frontend Developer", "React Developer", "Full Stack Developer", "Web Developer"],
  python:   ["Python Developer", "Backend Developer", "Data Analyst", "Automation Engineer"],
  sql:      ["Data Analyst", "Business Intelligence Analyst", "Database Developer"],
  general:  ["Software Developer", "IT Consultant", "Technical Project Manager"],
};

const RECOMMENDATIONS_POOL = [
  "Build a Figma case study portfolio — UI/UX roles see 3x more callbacks with project walkthroughs.",
  "Add your Firebase projects to GitHub with a live demo link to increase recruiter engagement.",
  "Consider a React course to complement your HTML/CSS/JS skills and unlock frontend roles.",
  "Your Python skills are underutilised — a small automation or data project can highlight them.",
  "SQL proficiency is high-demand; adding a portfolio query project can strengthen your data analyst fit.",
  "Apply for UI/UX internships or freelance gigs on Contra or Toptal to build paid portfolio entries.",
  "Your Figma skills match 78% of product designer job requirements — prioritise that role category.",
  "Certifications in Google UX Design or Meta Frontend Developer can boost shortlisting by 40%.",
];

// Deterministic skill scoring based on skill name string
function scoreSkill(name) {
  const n = name.toLowerCase();
  const proficiency = 65 + (n.charCodeAt(0) % 30);

  let wastage, status;
  const code = (n.charCodeAt(0) + n.length) % 3;
  if (code === 0) { wastage = 20 + (n.length % 15); status = "active"; }
  else if (code === 1) { wastage = 40 + (n.length % 20); status = "underused"; }
  else { wastage = 65 + (n.length % 25); status = "wasted"; }

  const reasons = {
    active:    "Regularly applied in current role and visible in recent project work.",
    underused: "Present in your background but not fully leveraged in your current position.",
    wasted:    "Strong proficiency exists but this skill has no outlet in your current role.",
  };

  return { name, proficiency, wastage, status, reason: reasons[status] };
}

function generateMockReport(fileName, profileSkills) {
  // Parse skills from profile (comma-separated string) or use defaults
  const rawSkills = profileSkills
    ? profileSkills.split(",").map((s) => s.trim()).filter(Boolean)
    : ["Figma", "Python", "SQL", "HTML", "CSS", "JavaScript", "Firebase"];

  const skills = rawSkills.map(scoreSkill);

  const activeCount    = skills.filter((s) => s.status === "active").length;
  const underusedCount = skills.filter((s) => s.status === "underused").length;
  const wastedCount    = skills.filter((s) => s.status === "wasted").length;
  const wastageIndex   = Math.round(
    skills.reduce((sum, s) => sum + s.wastage, 0) / skills.length
  );

  // Pick role matches based on skill keywords
  const lower = rawSkills.map((s) => s.toLowerCase()).join(" ");
  let roles = [...ROLE_POOL.general];
  if (lower.includes("figma") || lower.includes("ux") || lower.includes("ui")) roles = [...ROLE_POOL.design];
  else if (lower.includes("react") || lower.includes("html") || lower.includes("javascript")) roles = [...ROLE_POOL.frontend];
  else if (lower.includes("python")) roles = [...ROLE_POOL.python];
  else if (lower.includes("sql")) roles = [...ROLE_POOL.sql];

  const roleMatches = roles.slice(0, 3).map((title, i) => ({
    title,
    match: 84 - i * 7,
    companies: 1200 - i * 250,
  }));

  // Pick 3 recommendations semi-randomly but deterministically
  const seed = rawSkills.join("").length % RECOMMENDATIONS_POOL.length;
  const recommendations = [
    RECOMMENDATIONS_POOL[seed % RECOMMENDATIONS_POOL.length],
    RECOMMENDATIONS_POOL[(seed + 2) % RECOMMENDATIONS_POOL.length],
    RECOMMENDATIONS_POOL[(seed + 4) % RECOMMENDATIONS_POOL.length],
  ];

  return {
    fileName,
    skills,
    totalSkills: skills.length,
    activeCount,
    underusedCount,
    wastedCount,
    wastageIndex,
    roleMatches,
    recommendations,
  };
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function ResumeUpload() {
  const navigate = useNavigate();
  const fileRef  = useRef();

  const [step, setStep]     = useState(0);
  const [file, setFile]     = useState(null);
  const [dragging, setDrag] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError]   = useState(null);

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleFile = (f) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowed.includes(f.type)) {
      setError("Please upload a PDF, DOC, DOCX, or TXT file.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB.");
      return;
    }
    setError(null);
    setFile(f);
  };

  // Fake loading sequence — each step takes ~800ms
  const runFakeAnalysis = () => {
    if (!file) return;

    // Read profile skills from localStorage if saved from Profile page
    let profileSkills = "";
    try {
      const saved = localStorage.getItem("userProfile");
      if (saved) profileSkills = JSON.parse(saved).skills || "";
    } catch (_) {}

    setStep(1);
    setTimeout(() => {
      setStep(2);
      setTimeout(() => {
        const result = generateMockReport(file.name, profileSkills);
        try { localStorage.setItem("skillReport", JSON.stringify(result)); } catch (_) {}
        setReport(result);
        setStep(3);
      }, 1200);
    }, 900);
  };

  const reset = () => {
    setStep(0);
    setFile(null);
    setReport(null);
    setError(null);
  };

  const statusMeta = (s) => {
    const map = {
      active:    { bg: "#dcfce7", color: "#15803d", border: "#86efac", label: "Active"    },
      underused: { bg: "#fef9c3", color: "#a16207", border: "#fde68a", label: "Underused" },
      wasted:    { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5", label: "Wasted"    },
    };
    return map[s] || { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0", label: s };
  };

  const wastageColor = (w) => w > 60 ? "#ef4444" : w > 30 ? "#f59e0b" : "#22c55e";

  const reportId = file
    ? "SKL-" + btoa(file.name).replace(/[^A-Z0-9]/gi, "").substring(0, 7).toUpperCase()
    : "SKL-DEMO";

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5fb", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes pulse  { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .drop-zone { transition: all 0.2s; }
        .drop-zone:hover { border-color: #2563eb !important; background: #eff6ff !important; }
        .sk-card { transition: transform 0.18s, box-shadow 0.18s; }
        .sk-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,0.1) !important; }
        .nav-btn { transition: all 0.2s; }
        .nav-btn:hover { opacity: 0.88; }
      `}</style>

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg,#1a3a8f 0%,#2563eb 55%,#2dd4bf 100%)", paddingTop: 64 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 32px 52px" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
            Resume Upload
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 10 }}>
            Detect Your <span style={{ color: "#fbbf24" }}>Invisible</span> Skill Wastage
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: 480, marginBottom: 20 }}>
            Upload your resume and our AI will map every skill, quantify wastage, and surface hidden career opportunities.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["NLP Parsing", "Market Data", "AI Scoring", "Career Match"].map((t) => (
              <span key={t} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.85)", fontSize: "0.75rem", fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 32px 64px" }}>

        {/* STEP BAR */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px 28px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : "unset" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, background: i < step ? "#22c55e" : i === step ? "#2563eb" : "#f1f5f9", color: i <= step ? "#fff" : "#94a3b8", boxShadow: i === step ? "0 0 0 4px rgba(37,99,235,0.15)" : "none" }}>
                    {i < step
                      ? "✓"
                      : i === step && step > 0 && step < 3
                        ? <div style={{ width: 14, height: 14, border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        : i + 1}
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: i === step ? 700 : 500, color: i === step ? "#2563eb" : i < step ? "#22c55e" : "#94a3b8" }}>{s}</span>
                </div>
                {i < 3 && <div style={{ flex: 1, height: 2, background: i < step ? "#22c55e" : "#e2e8f0", marginBottom: 22, borderRadius: 2, transition: "background 0.4s" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 12, padding: "14px 18px", marginBottom: 20, color: "#dc2626", fontSize: "0.85rem", fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* ── STEP 0: UPLOAD ── */}
        {step === 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>

            <div
              className="drop-zone"
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current.click()}
              style={{ background: dragging ? "#eff6ff" : "#fff", border: "2px dashed " + (dragging ? "#2563eb" : file ? "#22c55e" : "#cbd5e1"), borderRadius: 16, padding: "48px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", minHeight: 280 }}
            >
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
              <div style={{ width: 64, height: 64, borderRadius: 16, background: file ? "#dcfce7" : "#f1f5fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", marginBottom: 16 }}>
                {file ? "✅" : "📄"}
              </div>
              {file ? (
                <>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>{file.name}</p>
                  <p style={{ fontSize: "0.8rem", color: "#64748b" }}>{(file.size / 1024).toFixed(1)} KB — Click to change</p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Drop your resume here</p>
                  <p style={{ fontSize: "0.85rem", color: "#2563eb", fontWeight: 600, marginBottom: 14 }}>or browse files</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 10 }}>
                    {["PDF", "DOC", "DOCX", "TXT"].map((t) => (
                      <span key={t} style={{ padding: "4px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, color: "#64748b" }}>{t}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Max file size: 10MB</p>
                </>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "🔒", title: "Private & Secure",   desc: "Processed in-memory, never stored on our servers" },
                { icon: "⚡", title: "30-Second Analysis", desc: "Full skill mapping and wastage report under 30s" },
                { icon: "🎯", title: "98% Accuracy",       desc: "NLP model trained on 50,000+ resumes and job listings" },
              ].map((b) => (
                <div key={b.title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "18px 16px", display: "flex", gap: 14, alignItems: "flex-start", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{b.icon}</span>
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{b.title}</p>
                    <p style={{ fontSize: "0.77rem", color: "#64748b", lineHeight: 1.5, margin: 0 }}>{b.desc}</p>
                  </div>
                </div>
              ))}

              {file && (
                <button onClick={runFakeAnalysis} style={{ padding: "14px 20px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", fontFamily: "inherit", fontSize: "0.92rem", fontWeight: 700, boxShadow: "0 4px 14px rgba(37,99,235,0.3)", animation: "fadeUp 0.3s ease" }}>
                  Analyze My Resume
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 1-2: LOADING ── */}
        {(step === 1 || step === 2) && (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "60px 32px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 56, height: 56, border: "4px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 24px" }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
              {step === 1 ? "Reading Your Resume..." : "AI Analysing Skills..."}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b", maxWidth: 340, margin: "0 auto" }}>
              {step === 1
                ? "Extracting text and understanding your background"
                : "Mapping skills, calculating wastage, finding best role matches"}
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {["Parsing resume", "Extracting skills", "Scoring wastage", "Matching roles"].map((t, i) => (
                <span key={t} style={{ padding: "5px 12px", borderRadius: 20, background: "#eff6ff", color: "#2563eb", fontSize: "0.72rem", fontWeight: 600, animation: "pulse 1.5s ease " + (i * 0.3) + "s infinite" }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: RESULTS ── */}
        {step === 3 && report && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>

            {/* Action bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
              <span style={{ padding: "8px 16px", borderRadius: 20, background: "#dcfce7", color: "#16a34a", fontSize: "0.8rem", fontWeight: 700, border: "1px solid #86efac" }}>
                Analysis Complete
              </span>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={reset} className="nav-btn" style={{ padding: "9px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
                  New Upload
                </button>
                <button onClick={() => navigate("/dashboard")} className="nav-btn" style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}>
                  View Full Dashboard
                </button>
              </div>
            </div>

            {/* Summary card */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 24px", marginBottom: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="36" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <circle cx="45" cy="45" r="36" fill="none" stroke={report.wastageIndex > 60 ? "#ef4444" : report.wastageIndex > 30 ? "#f59e0b" : "#22c55e"} strokeWidth="10" strokeDasharray={report.wastageIndex * 2.26 + " 226"} strokeLinecap="round" transform="rotate(-90 45 45)" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{report.wastageIndex}</span>
                  <span style={{ fontSize: "0.55rem", color: "#94a3b8", fontWeight: 600 }}>WASTAGE%</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Skill Wastage Report</h3>
                <p style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: 14 }}>{report.fileName}</p>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  {[
                    { label: "Skills Found", val: report.totalSkills,    color: "#2563eb" },
                    { label: "Active",        val: report.activeCount,    color: "#22c55e" },
                    { label: "Underused",     val: report.underusedCount, color: "#f59e0b" },
                    { label: "Wasted",        val: report.wastedCount,    color: "#ef4444" },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "1.4rem", fontWeight: 800, color: s.color, margin: 0 }}>{s.val}</p>
                      <p style={{ fontSize: "0.68rem", color: "#94a3b8", margin: 0 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14, marginBottom: 18 }}>
              {report.skills.map((skill) => {
                const m = statusMeta(skill.status);
                return (
                  <div key={skill.name} className="sk-card" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>{skill.name}</span>
                      <span style={{ fontSize: "0.65rem", padding: "3px 8px", borderRadius: 8, background: m.bg, color: m.color, border: "1px solid " + m.border, fontWeight: 600 }}>{m.label}</span>
                    </div>
                    {[["Proficiency", skill.proficiency, "#3b82f6"], ["Wastage", skill.wastage, wastageColor(skill.wastage)]].map(([lbl, val, col]) => (
                      <div key={lbl} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: "0.68rem", color: "#64748b" }}>{lbl}</span>
                          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: col }}>{val}%</span>
                        </div>
                        <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: val + "%", height: "100%", background: col, borderRadius: 2 }} />
                        </div>
                      </div>
                    ))}
                    <p style={{ fontSize: "0.7rem", color: "#64748b", margin: 0, lineHeight: 1.5, borderTop: "1px solid #f8fafc", paddingTop: 8 }}>{skill.reason}</p>
                  </div>
                );
              })}
            </div>

            {/* Role matches + Recommendations */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>Best Role Matches</h3>
                  <span style={{ fontSize: "0.65rem", padding: "3px 10px", borderRadius: 8, background: "#eff6ff", color: "#2563eb", fontWeight: 700, border: "1px solid #bfdbfe" }}>AI Suggested</span>
                </div>
                {report.roleMatches.map((r) => (
                  <div key={r.title} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>{r.title}</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#2563eb" }}>{r.match}%</span>
                    </div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
                      <div style={{ width: r.match + "%", height: "100%", background: "linear-gradient(90deg,#2563eb,#3b82f6)", borderRadius: 3 }} />
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#94a3b8", margin: 0 }}>{r.companies.toLocaleString()} companies hiring</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <h3 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>AI Recommendations</h3>
                {report.recommendations.map((rec, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: i < 2 ? "1px solid #f8fafc" : "none", alignItems: "flex-start" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 800, color: "#2563eb", flexShrink: 0 }}>{"0" + (i + 1)}</div>
                    <p style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.6, margin: 0, flex: 1 }}>{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => navigate("/profile")} className="nav-btn" style={{ padding: "10px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontFamily: "inherit", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
                Back to Profile
              </button>
              <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Report ID: {reportId}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}