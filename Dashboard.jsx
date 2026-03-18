import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

// ─────────────────────────────────────────────────────────
// Helpers to read data saved by Profile.jsx + ResumeUpload.jsx
// ─────────────────────────────────────────────────────────
function loadProfile() {
  try { return JSON.parse(localStorage.getItem("userProfile")) || null; } catch { return null; }
}
function loadReport() {
  try { return JSON.parse(localStorage.getItem("skillReport")) || null; } catch { return null; }
}

// Build radar data from skill report
function buildRadarData(skills) {
  return skills.map((s) => ({
    skill:     s.name.length > 10 ? s.name.substring(0, 10) : s.name,
    fullName:  s.name,
    possessed: s.proficiency,
    utilized:  Math.max(0, s.proficiency - s.wastage),
  }));
}

// Build upskill suggestions based on wasted skills
function buildUpskillSuggestions(skills) {
  const wasted = skills.filter((s) => s.status === "wasted" || s.status === "underused");
  const suggestions = [
    { skill: "Portfolio Projects",  reason: "Showcase underused skills to recruiters with live demos", icon: "🗂️", impact: 38 },
    { skill: "LinkedIn Optimisation", reason: "Profile with skills listed gets 3x more recruiter views", icon: "💼", impact: 32 },
    { skill: "Freelance Projects",  reason: "Apply wasted skills via Contra or Toptal to build credibility", icon: "🌐", impact: 28 },
    { skill: "Certifications",      reason: "Validate skills officially to unlock senior-level roles",   icon: "🏅", impact: 24 },
  ];
  // Prepend skill-specific suggestions for top wasted skills
  wasted.slice(0, 2).forEach((s, i) => {
    suggestions.unshift({
      skill:  s.name + " Deep Dive",
      reason: "Underutilised in your current role — a focused project can prove mastery",
      icon:   i === 0 ? "🔥" : "🤖",
      impact: 40 - i * 5,
    });
  });
  return suggestions.slice(0, 4);
}

// Build role recommendations from report roleMatches + extra context
function buildRoleRecommendations(roleMatches) {
  const tags = ["Best Fit", "Strong Match", "Good Fit", "Consider", "Possible"];
  const icons = ["🔬", "⚙️", "📝", "📊", "💻"];
  return roleMatches.map((r, i) => ({
    role:  r.title,
    match: r.match,
    tag:   tags[i] || "Possible",
    icon:  icons[i] || "💡",
    companies: r.companies,
  }));
}

const PIE_COLORS = ["#2563eb", "#e2e8f0"];

const tagMeta = (tag) =>
  ({
    "Best Fit":     { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    "Strong Match": { bg: "#f0f9ff", color: "#0369a1", border: "#bae6fd" },
    "Good Fit":     { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    "Consider":     { bg: "#fefce8", color: "#a16207", border: "#fde68a" },
    "Possible":     { bg: "#f8fafc", color: "#475569", border: "#cbd5e1" },
  }[tag] || { bg: "#f8fafc", color: "#475569", border: "#cbd5e1" });

// ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const [tab, setTab] = useState("overview");
  const [loaded, setLoaded] = useState(false);

  const profile = loadProfile();
  const report  = loadReport();

  useEffect(() => { setTimeout(() => setLoaded(true), 300); }, []);

  // If no report yet, show a prompt to upload resume
  if (!report) {
    return (
      <div style={{ minHeight: "100vh", background: "#f1f5fb", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: "48px 40px", textAlign: "center", maxWidth: 420, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>📊</div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>No Report Yet</h2>
          <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>
            Complete your profile and upload your resume to generate your personalised skill wastage dashboard.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {!profile && (
              <button onClick={() => navigate("/profile")} style={{ padding: "12px 24px", borderRadius: 10, border: "1.5px solid #2563eb", background: "#fff", color: "#2563eb", fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer" }}>
                Go to Profile →
              </button>
            )}
            <button onClick={() => navigate("/upload")} style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", fontFamily: "inherit", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.28)" }}>
              Upload Resume →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Derived data from real profile + report ──
  const displayName  = user?.displayName || profile?.name || "User";
  const firstName    = displayName.split(" ")[0];
  const currentJob   = profile?.job    || "Professional";
  const education    = profile?.education || "";
  const skillsList   = report.skills.map((s) => s.name);

  const radarData         = buildRadarData(report.skills);
  const upskillSuggestions = buildUpskillSuggestions(report.skills);
  const recommendations    = buildRoleRecommendations(report.roleMatches);

  const pieData = [
    { name: "Underutilized", value: report.wastageIndex },
    { name: "Utilized",      value: 100 - report.wastageIndex },
  ];

  const topWasted = report.skills
    .filter((s) => s.status === "wasted" || s.status === "underused")
    .slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5fb", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .tab-btn:hover:not(.tab-on) { background: #eff6ff !important; color: #2563eb !important; }
        .d-card { transition: transform 0.2s, box-shadow 0.2s; }
        .d-card:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(37,99,235,0.09) !important; }
        .pfill { height: 100%; border-radius: 4px; transition: width 1.2s ease; }
        @media(max-width:880px) { .ov-grid{ grid-template-columns: 1fr 1fr !important; } }
        @media(max-width:600px) { .ov-grid{ grid-template-columns: 1fr !important; } .tab-bar{ flex-wrap: wrap; } }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(135deg,#1a3a8f 0%,#2563eb 55%,#2dd4bf 100%)", paddingTop: 64 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 40px 60px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Dashboard</p>
            <h1 style={{ fontSize: "clamp(1.7rem,3vw,2.4rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 6 }}>
              Welcome back, <span style={{ color: "#fbbf24" }}>{firstName}</span> 👋
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>{currentJob}</p>
            {report.fileName && (
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", marginTop: 4 }}>
                Report based on: {report.fileName}
              </p>
            )}
          </div>

          {/* Hero stats — all from real report */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
            {[
              { label: "Wastage Score", val: report.wastageIndex + "%", color: "#fbbf24" },
              { label: "Skills Found",  val: report.totalSkills,        color: "#fff"    },
              { label: "Role Matches",  val: recommendations.length,    color: "#4ade80" },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14, padding: "14px 20px", textAlign: "center", minWidth: 88 }}>
                <div style={{ fontSize: "1.55rem", fontWeight: 800, color: s.color, fontFamily: "monospace", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.62)", marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "28px 40px 64px" }}>

        {/* Tabs */}
        <div className="tab-bar" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "7px", display: "flex", gap: 4, marginBottom: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {[
            ["overview",       "📊 Overview"  ],
            ["skills",         "🧠 Skills"    ],
            ["recommendations","🎯 Roles"     ],
            ["upskilling",     "📚 Upskilling"],
          ].map(([id, label]) => (
            <button key={id} className={"tab-btn " + (tab === id ? "tab-on" : "")} onClick={() => setTab(id)}
              style={{ padding: "9px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: "0.84rem", fontWeight: 600, fontFamily: "inherit", background: tab === id ? "#2563eb" : "transparent", color: tab === id ? "#fff" : "#64748b", boxShadow: tab === id ? "0 4px 12px rgba(37,99,235,0.22)" : "none", transition: "all 0.15s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <div className="ov-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 18 }}>

              {/* Gauge */}
              <div style={S.card} className="d-card">
                <p style={S.label}>Skill Wastage Score</p>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                  <svg width="190" height="110" viewBox="0 0 200 115">
                    <defs>
                      <linearGradient id="arcG" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="#22c55e" />
                        <stop offset="50%"  stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f5f9"    strokeWidth="14" strokeLinecap="round" />
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#arcG)" strokeWidth="14" strokeLinecap="round"
                      strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - report.wastageIndex / 100)}
                      style={{ transition: "stroke-dashoffset 1.5s ease" }} />
                    <text x="100" y="92"  textAnchor="middle" fontSize="26" fontWeight="bold" fill="#f59e0b" fontFamily="monospace">{report.wastageIndex}%</text>
                    <text x="100" y="108" textAnchor="middle" fontSize="9"  fill="#94a3b8">SKILL WASTAGE SCORE</text>
                  </svg>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.7rem", color: "#22c55e", fontWeight: 600 }}>● Optimal</span>
                  <span style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 600 }}>Critical ●</span>
                </div>
              </div>

              {/* Pie */}
              <div style={S.card} className="d-card">
                <p style={S.label}>Skill Utilization Split</p>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={44} outerRadius={66} dataKey="value" paddingAngle={2}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Profile card — from real profile data */}
              <div style={S.card} className="d-card">
                <p style={S.label}>Skill Profile</p>
                {education && <p style={{ fontSize: "0.76rem", color: "#64748b", marginBottom: 4 }}>{education}</p>}
                <p style={{ fontSize: "0.86rem", color: "#0f172a", fontWeight: 600, marginBottom: 14 }}>{currentJob}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {skillsList.map((s) => (
                    <span key={s} style={{ fontSize: "0.72rem", padding: "4px 11px", borderRadius: 20, background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
              {[
                { label: "Total Skills",   val: report.totalSkills,    color: "#2563eb", bg: "#eff6ff",  border: "#bfdbfe" },
                { label: "Active",         val: report.activeCount,    color: "#16a34a", bg: "#dcfce7",  border: "#86efac" },
                { label: "Underused",      val: report.underusedCount, color: "#a16207", bg: "#fef9c3",  border: "#fde68a" },
                { label: "Wasted",         val: report.wastedCount,    color: "#dc2626", bg: "#fee2e2",  border: "#fca5a5" },
              ].map((s) => (
                <div key={s.label} style={{ background: s.bg, border: "1px solid " + s.border, borderRadius: 14, padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: s.color, fontFamily: "monospace", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: "0.72rem", color: s.color, marginTop: 6, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Top Wasted Skills */}
            {topWasted.length > 0 && (
              <div style={S.card} className="d-card">
                <p style={S.label}>Top Wasted / Underused Skills</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 16 }}>
                  {topWasted.map((skill) => (
                    <div key={skill.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "#0f172a" }}>{skill.name}</span>
                        <span style={{ fontSize: "0.73rem", color: "#ef4444" }}>{skill.wastage}% wasted</span>
                      </div>
                      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                        <div className="pfill" style={{ width: loaded ? skill.proficiency + "%" : "0%", background: "linear-gradient(90deg,#ef4444,#fca5a5)" }} />
                      </div>
                      <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: 5 }}>{skill.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendations preview */}
            <div style={{ ...S.card, marginTop: 18 }}>
              <p style={S.label}>AI Recommendations</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {report.recommendations.map((rec, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 800, color: "#2563eb", flexShrink: 0 }}>
                      {"0" + (i + 1)}
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SKILLS ── */}
        {tab === "skills" && (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <div style={{ ...S.card, marginBottom: 18 }}>
              <p style={S.label}>Skill Radar — Proficiency vs Utilization</p>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: "#475569" }} />
                  <Radar name="Proficiency" dataKey="possessed" stroke="#2563eb" fill="#2563eb" fillOpacity={0.12} strokeWidth={2} />
                  <Radar name="Utilized"    dataKey="utilized"  stroke="#f97316" fill="#f97316" fillOpacity={0.12} strokeWidth={2} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 14 }}>
              {report.skills.map((skill) => {
                const wp = skill.wastage;
                const st = wp > 60
                  ? { l: "Wasted",    bg: "#fee2e2", c: "#dc2626" }
                  : wp > 30
                    ? { l: "Underused", bg: "#fef9c3", c: "#a16207" }
                    : { l: "Active",    bg: "#dcfce7", c: "#16a34a" };
                return (
                  <div key={skill.name} style={{ ...S.card, padding: "16px 17px" }} className="d-card">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>{skill.name}</span>
                      <span style={{ fontSize: "0.68rem", padding: "2px 9px", borderRadius: 10, background: st.bg, color: st.c, fontWeight: 600 }}>{st.l}</span>
                    </div>
                    {[["Proficiency", skill.proficiency, "#2563eb"], ["Wastage", skill.wastage, wp > 60 ? "#ef4444" : wp > 30 ? "#f59e0b" : "#22c55e"]].map(([l, v, c]) => (
                      <div key={l} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>{l}</span>
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: c }}>{v}%</span>
                        </div>
                        <div style={{ height: 5, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                          <div className="pfill" style={{ width: loaded ? v + "%" : "0%", background: c }} />
                        </div>
                      </div>
                    ))}
                    <p style={{ fontSize: "0.7rem", color: "#94a3b8", margin: 0, lineHeight: 1.5, borderTop: "1px solid #f8fafc", paddingTop: 8 }}>{skill.reason}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ROLES ── */}
        {tab === "recommendations" && (
          <div style={{ animation: "fadeUp 0.4s ease both", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ ...S.card, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>🎯</span>
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1d4ed8", marginBottom: 4 }}>AI-Powered Role Recommendations</p>
                  <p style={{ fontSize: "0.82rem", color: "#1e3a8a", lineHeight: 1.55, margin: 0 }}>
                    Based on your skill profile and a Skill Wastage Score of <strong>{report.wastageIndex}%</strong>, these roles would best utilise your full potential.
                  </p>
                </div>
              </div>
            </div>

            {recommendations.map((r) => {
              const ts = tagMeta(r.tag);
              return (
                <div key={r.role} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }} className="d-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{r.icon}</div>
                    <div>
                      <p style={{ fontSize: "0.93rem", fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{r.role}</p>
                      <p style={{ fontSize: "0.74rem", color: "#94a3b8", margin: 0 }}>{r.companies ? r.companies.toLocaleString() + " companies hiring" : "AI-matched based on your skill profile"}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: "0.7rem", padding: "4px 11px", borderRadius: 20, background: ts.bg, color: ts.color, border: "1px solid " + ts.border, fontWeight: 600 }}>{r.tag}</span>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "monospace", fontSize: "1.5rem", fontWeight: 700, color: r.match > 85 ? "#16a34a" : r.match > 70 ? "#d97706" : "#64748b", lineHeight: 1 }}>{r.match}%</div>
                      <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: 3 }}>Match</div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div style={S.card}>
              <p style={{ ...S.label, marginBottom: 14 }}>Role Match Comparison</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={recommendations} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis dataKey="role" type="category" tick={{ fill: "#475569", fontSize: 11 }} width={130} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="match" name="Match %" radius={[0, 6, 6, 0]}>
                    {recommendations.map((r, i) => (
                      <Cell key={i} fill={r.match > 85 ? "#22c55e" : r.match > 75 ? "#2563eb" : "#60a5fa"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── UPSKILLING ── */}
        {tab === "upskilling" && (
          <div style={{ animation: "fadeUp 0.4s ease both", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ ...S.card, background: "#f0f9ff", border: "1px solid #bae6fd" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>📚</span>
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0369a1", marginBottom: 4 }}>Personalised Learning Pathway</p>
                  <p style={{ fontSize: "0.82rem", color: "#0c4a6e", lineHeight: 1.55, margin: 0 }}>
                    These actions will reduce your wastage score and increase your job-fit. Recommended based on your actual skill gaps.
                  </p>
                </div>
              </div>
            </div>

            {upskillSuggestions.map((s) => (
              <div key={s.skill} style={S.card} className="d-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f0f9ff", border: "1px solid #bae6fd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{s.icon}</div>
                    <div>
                      <p style={{ fontSize: "0.93rem", fontWeight: 700, color: "#0369a1", marginBottom: 3 }}>{s.skill}</p>
                      <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>{s.reason}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: 8, background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>High Demand</span>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Projected impact on wastage score</span>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0369a1" }}>-{s.impact}% reduction</span>
                  </div>
                  <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                    <div className="pfill" style={{ width: loaded ? s.impact + "%" : "0%", background: "linear-gradient(90deg,#0ea5e9,#38bdf8)" }} />
                  </div>
                </div>
              </div>
            ))}

            <div style={{ ...S.card, border: "1px solid #bbf7d0" }}>
              <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#15803d", marginBottom: 14 }}>🗓️ Suggested 90-Day Learning Plan</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 11 }}>
                {[
                  { period: "Month 1", focus: "Strengthen wasted skills with one focused project", bg: "#eff6ff", c: "#1d4ed8", border: "#bfdbfe" },
                  { period: "Month 2", focus: "Build a public portfolio or GitHub showcase",        bg: "#f0f9ff", c: "#0369a1", border: "#bae6fd" },
                  { period: "Month 3", focus: "Apply for target roles + freelance gigs",            bg: "#f0fdf4", c: "#15803d", border: "#bbf7d0" },
                ].map((p) => (
                  <div key={p.period} style={{ background: p.bg, borderRadius: 11, padding: "13px 15px", border: "1px solid " + p.border }}>
                    <div style={{ fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{p.period}</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: p.c }}>{p.focus}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  card:  { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
  label: { fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 12 },
};