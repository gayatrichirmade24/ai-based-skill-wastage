import { useState, useEffect } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const mockUser = {
  name: "Nisha Kuvalekar",
  email: "nisha@example.com",
  education: "B.Tech – Information Technology",
  current_job: "Intern – Data Science at Skillenza",
  skills: ["Python", "Machine Learning", "NLP", "React", "SQL", "TensorFlow", "Data Analysis", "Power BI"],
  resume_url: "#",
};

const skillWastageScore = 72;

const radarData = [
  { skill: "Python",     possessed: 90, utilized: 10 },
  { skill: "ML",         possessed: 85, utilized: 5  },
  { skill: "NLP",        possessed: 75, utilized: 0  },
  { skill: "React",      possessed: 70, utilized: 20 },
  { skill: "SQL",        possessed: 80, utilized: 30 },
  { skill: "TensorFlow", possessed: 65, utilized: 0  },
  { skill: "Power BI",   possessed: 60, utilized: 15 },
];

const pieData = [
  { name: "Underutilized Skills", value: 72 },
  { name: "Utilized Skills",      value: 28 },
];

const recommendations = [
  { role: "Data Scientist",       match: 91, tag: "Best Fit"     },
  { role: "ML Engineer",          match: 87, tag: "Strong Match" },
  { role: "NLP Researcher",       match: 82, tag: "Good Fit"     },
  { role: "BI Analyst",           match: 74, tag: "Consider"     },
  { role: "Full Stack Developer", match: 68, tag: "Possible"     },
];

const upskillSuggestions = [
  { skill: "PyTorch",         reason: "Complements TensorFlow for deep learning roles" },
  { skill: "LLM Fine-tuning", reason: "High demand in NLP job market 2025"             },
  { skill: "FastAPI",         reason: "Backend for ML model deployment"                 },
  { skill: "Spark / Hadoop",  reason: "Required in senior Data Engineering roles"      },
];

const PIE_COLORS = ["#3b82f6", "#e2e8f0"];
const RADAR_COLORS = { possessed: "#ffa768", utilized: "#0ea5e9" };

function WastageGauge({ score }) {
  const angle = -90 + (score / 100) * 180;
  const color = score > 60 ? "#3b82f6" : score > 30 ? "#eab308" : "#22c55e";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="200" height="115" viewBox="0 0 200 115">
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#22c55e" />
            <stop offset="50%"  stopColor="#eab308" />
            <stop offset="100%" stopColor="#f6733b" />
          </linearGradient>
        </defs>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round"/>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#arcGrad)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - score / 100)} style={{ transition: "stroke-dashoffset 1.5s ease" }}/>
        <g transform={`rotate(${angle}, 100, 100)`}>
          {/* <line x1="100" y1="100" x2="100" y2="28" stroke={color} strokeWidth="3" strokeLinecap="round"/>
          <circle cx="100" cy="100" r="6" fill={color}/> */}
        </g>
        <text x="100" y="95" textAnchor="middle" fontSize="28" fontWeight="bold" fill={color} fontFamily="'Space Mono', monospace">{score}%</text>
        <text x="100" y="110" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="'DM Sans', sans-serif">SKILL WASTAGE SCORE</text>
      </svg>
    </div>
  );
}

function Tag({ label }) {
  const map = {
    "Best Fit":     { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    "Strong Match": { bg: "#f0f9ff", color: "#0369a1", border: "#bae6fd" },
    "Good Fit":     { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    "Consider":     { bg: "#fefce8", color: "#a16207", border: "#fde68a" },
    "Possible":     { bg: "#f8fafc", color: "#475569", border: "#cbd5e1" },
  };
  const s = map[label] || map["Possible"];
  return (
    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontWeight: 600 }}>{label}</span>
  );
}

export default function SkillWastageDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f1f5f9", minHeight: "100vh", color: "#1e293b" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; }
        .card-hover { transition: transform .2s, box-shadow .2s; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.08); }
        .tab-btn { padding: 8px 20px; border-radius: 8px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; transition: all .2s; }
        .tab-active { background: #3b82f6; color: #fff; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); }
        .tab-inactive { background: #ffffff; color: #64748b; border: 1px solid #e2e8f0; }
        .tab-inactive:hover { background: #eff6ff; color: #3b82f6; border-color: #bfdbfe; }
        .skill-pill { display:inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; margin: 3px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        .fade-in { opacity: 0; animation: fadeIn .5s forwards; }
        @keyframes fadeIn { to { opacity: 1; } }
        .stagger-1 { animation-delay: .05s; }
        .stagger-2 { animation-delay: .12s; }
        .stagger-3 { animation-delay: .20s; }
        .stagger-4 { animation-delay: .28s; }
        .progress-bar { height: 7px; border-radius: 4px; background: #f1f5f9; overflow: hidden; border: 1px solid #e2e8f0; }
        .progress-fill { height: 100%; border-radius: 4px; transition: width 1.2s ease; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧠</div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, fontWeight: 700, color: "#1e293b", letterSpacing: "0.03em" }}>SkillRadar AI</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Invisible Skill Wastage Detector</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #fb923c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>P</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{mockUser.name}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{mockUser.current_job}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 28px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {["overview", "skills", "recommendations", "upskilling"].map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? "tab-active" : "tab-inactive"}`} onClick={() => setActiveTab(t)}>
              {{ overview: "📊 Overview", skills: "🎯 Skill Analysis", recommendations: "💼 Roles", upskilling: "📚 Upskilling" }[t]}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gap: 20 }}>
           
           <div className="card fade-in stagger-4">
              <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Profile Summary</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[["🎓 Education", mockUser.education], ["💼 Current Role", mockUser.current_job], ["📧 Email", mockUser.email]].map(([label, val]) => (
                  <div key={label} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 16px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#1e293b" }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>📌 All Skills in Profile</div>
                <div>{mockUser.skills.map(s => <span key={s} className="skill-pill">{s}</span>)}</div>
              </div>
            </div>
           
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {[
                { label: "Skills Possessed",  value: mockUser.skills.length, icon: "🧩", sub: "Across all domains",       iconBg: "#eff6ff", color: "#2563eb" },
                { label: "Skills Utilized",    value: 3,                       icon: "✅", sub: "In current role",          iconBg: "#f0fdf4", color: "#16a34a" },
                { label: "Skills Wasted",      value: 5,                       icon: "⚠️", sub: "Underutilized potential",  iconBg: "#eff6ff", color: "#2563eb" },
                { label: "Recommended Roles",  value: recommendations.length,  icon: "🚀", sub: "Better-fit opportunities", iconBg: "#faf5ff", color: "#7c3aed" },
              ].map((s, i) => (
                <div key={i} className={`card card-hover fade-in stagger-${i + 1}`}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="card fade-in stagger-2" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Wastage Score Meter</div>
                <WastageGauge score={skillWastageScore} />
                <div style={{ fontSize: 12, color: "#64748b", textAlign: "center", maxWidth: 220, lineHeight: 1.6 }}>
                  72% of your skills are not being used in your current role as <span style={{ color: "#3b82f6", fontWeight: 600 }}>{mockUser.current_job}</span>.
                </div>
              </div>
              <div className="card fade-in stagger-3">
                <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Skill Utilization Breakdown</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} stroke={i === 1 ? "#cbd5e1" : "none"} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, color: "#1e293b" }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#475569" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            
          </div>
        )}

        {/* SKILL ANALYSIS */}
        {activeTab === "skills" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div className="card fade-in stagger-1">
              <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Possessed vs. Utilized — Radar View</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>The gap between orange and blue areas represents your invisible skill wastage.</div>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Radar name="Possessed" dataKey="possessed" stroke={RADAR_COLORS.possessed} fill={RADAR_COLORS.possessed} fillOpacity={0.18} />
                  <Radar name="Utilized"  dataKey="utilized"  stroke={RADAR_COLORS.utilized}  fill={RADAR_COLORS.utilized}  fillOpacity={0.18} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#475569" }} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="card fade-in stagger-2">
              <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Skill Gap Per Competency</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={radarData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="skill" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="possessed" name="Possessed" fill="#3b82f6" radius={[4,4,0,0]} />
                  <Bar dataKey="utilized"  name="Utilized"  fill="#0ea5e9" radius={[4,4,0,0]} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#475569" }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card fade-in stagger-3">
              <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Detailed Skill Utilization</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {radarData.map(d => {
                  const gap = d.possessed - d.utilized;
                  const status = gap > 60 ? { label: "Wasted", color: "#2563eb" } : gap > 30 ? { label: "Partial", color: "#d97706" } : { label: "Active", color: "#16a34a" };
                  return (
                    <div key={d.skill}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{d.skill}</span>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>Utilized: {d.utilized}%</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: status.color, background: `${status.color}15`, padding: "2px 8px", borderRadius: 20, border: `1px solid ${status.color}30` }}>{status.label}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Possessed</div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${loaded ? d.possessed : 0}%`, background: `linear-gradient(90deg, ${status.color}, ${status.color}99)` }} />
                      </div>
                      <div style={{ fontSize: 10, color: "#94a3b8", margin: "4px 0 3px" }}>Utilized</div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${loaded ? d.utilized : 0}%`, transition: "width 1.4s ease", background: "linear-gradient(90deg, #0ea5e9, #38bdf8)" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* RECOMMENDATIONS */}
        {activeTab === "recommendations" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div className="card fade-in stagger-1" style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1px solid #bfdbfe" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ fontSize: 28 }}>🎯</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1d4ed8" }}>AI-Powered Role Recommendations</div>
                  <div style={{ fontSize: 12, color: "#1e3a8a", marginTop: 4 }}>
                    Based on your skill profile and a Skill Wastage Score of <strong style={{ color: "#3b82f6" }}>72%</strong>, these roles would utilize your full potential.
                  </div>
                </div>
              </div>
            </div>

            {recommendations.map((r, i) => (
              <div key={r.role} className={`card card-hover fade-in stagger-${Math.min(i+1,4)}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {["🔬","⚙️","📝","📊","💻"][i]}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>{r.role}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>AI-matched based on your skill profile</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Tag label={r.tag} />
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: r.match > 85 ? "#16a34a" : r.match > 70 ? "#d97706" : "#64748b" }}>{r.match}%</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>Match</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="card fade-in stagger-4">
              <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Role Match Comparison</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={recommendations} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" domain={[0,100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis dataKey="role" type="category" tick={{ fill: "#475569", fontSize: 12 }} width={145} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="match" name="Match %" radius={[0,6,6,0]}>
                    {recommendations.map((r, i) => <Cell key={i} fill={r.match > 85 ? "#22c55e" : r.match > 75 ? "#3b82f6" : "#0ea5e9"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* UPSKILLING */}
        {activeTab === "upskilling" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div className="card fade-in stagger-1" style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", border: "1px solid #bae6fd" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ fontSize: 28 }}>📚</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0369a1" }}>Personalized Learning Pathway</div>
                  <div style={{ fontSize: 12, color: "#0c4a6e", marginTop: 4 }}>
                    These skills will increase your job-fit score and reduce skill wastage. Recommended by AI analysis of current market demand.
                  </div>
                </div>
              </div>
            </div>

            {upskillSuggestions.map((s, i) => (
              <div key={s.skill} className={`card card-hover fade-in stagger-${Math.min(i+1,4)}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f0f9ff", border: "1px solid #bae6fd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      {["🔥","🤖","🌐","☁️"][i]}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#0369a1" }}>{s.skill}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.reason}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd", whiteSpace: "nowrap", fontWeight: 600 }}>High Demand</span>
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>Projected impact on wastage score</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${loaded ? [40,35,30,25][i] : 0}%`, background: "linear-gradient(90deg, #0ea5e9, #38bdf8)" }} />
                  </div>
                  <div style={{ fontSize: 10, color: "#0369a1", marginTop: 4, fontWeight: 600 }}>–{[40,35,30,25][i]}% reduction in wastage</div>
                </div>
              </div>
            ))}

            <div className="card fade-in stagger-4" style={{ border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#15803d", marginBottom: 12 }}>🗓️ Suggested 90-Day Learning Plan</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
                {[
                  { period: "Month 1", focus: "PyTorch Basics",      bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
                  { period: "Month 2", focus: "FastAPI + LLMs",       bg: "#f0f9ff", color: "#0369a1", border: "#bae6fd" },
                  { period: "Month 3", focus: "Projects + Portfolio", bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
                ].map(p => (
                  <div key={p.period} style={{ background: p.bg, borderRadius: 10, padding: "12px 14px", border: `1px solid ${p.border}` }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.period}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: p.color, marginTop: 4 }}>{p.focus}</div>
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