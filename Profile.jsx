import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/style.css";

const SKILLS_SAMPLE = [
  { name: "React.js",         level: 95, wastage: 10, status: "active"   },
  { name: "Node.js",          level: 82, wastage: 65, status: "underused" },
  { name: "Machine Learning", level: 78, wastage: 88, status: "wasted"   },
  { name: "TypeScript",       level: 90, wastage: 5,  status: "active"   },
  { name: "Python",           level: 85, wastage: 45, status: "underused" },
  { name: "AWS Cloud",        level: 70, wastage: 72, status: "wasted"   },
];

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: "", education: "", skills: "", job: "" });
  const [errors, setErrors]   = useState({});
  const [saved, setSaved]     = useState(false);
  const [filter, setFilter]   = useState("all");

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (profile.name.trim().length < 3)   e.name      = "Name must be at least 3 characters";
    if (!profile.education)               e.education = "Education is required";
    if (!profile.skills.trim())           e.skills    = "Enter at least one skill";
    if (profile.job && profile.job.length < 3) e.job  = "Job must be at least 3 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) { toast.success("Profile Saved Successfully!"); setSaved(true); }
  };

  const filtered = filter === "all" ? SKILLS_SAMPLE : SKILLS_SAMPLE.filter(s => s.status === filter);

  const statusClass = (s) => s === "active" ? "tag-green" : s === "underused" ? "tag-gold" : "tag-red";
  const statusLabel = (s) => s === "active" ? "● Active" : s === "underused" ? "◆ Underused" : "⚠ Wasted";

  return (
    <div className="profile-page">

      {/* ── PAGE HEADER ── */}
      <div className="ph-header">
        <div>
          <p className="ph-eyebrow">Profile</p>
          <h1 className="ph-title">Your Skill<span className="ph-accent"> Intelligence</span></h1>
          <p className="ph-desc">Fill your profile and see your AI-powered skill wastage analysis below.</p>
        </div>
        <div className="ph-badge">
          <span className="badge-dot" />
          AI Analysis Active
        </div>
      </div>

      {/* ── TOP GRID: form + stats ── */}
      <div className="top-grid">

        {/* Profile Form / View */}
        <div className="card">
          <h2 className="card-title">
            {saved ? (
              <><span className="title-icon green">✓</span> Profile Saved</>
            ) : (
              <><span className="title-icon cyan">◆</span> Complete Your Profile</>
            )}
          </h2>

          {saved ? (
            <div className="profile-view">
              <div className="pv-row"><span className="pv-label">Name</span><span className="pv-val">{profile.name}</span></div>
              <div className="pv-row"><span className="pv-label">Education</span><span className="pv-val">{profile.education}</span></div>
              <div className="pv-row"><span className="pv-label">Skills</span><span className="pv-val">{profile.skills}</span></div>
              <div className="pv-row"><span className="pv-label">Current Job</span><span className="pv-val">{profile.job || "—"}</span></div>
              <button className="btn" style={{ marginTop: "20px" }} onClick={() => setSaved(false)}>Edit Profile</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label">Full Name</label>
                <input className="field-input" type="text" name="name" value={profile.name} onChange={handleChange} placeholder="e.g. Arjun Sharma" />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>
              <div className="field">
                <label className="field-label">Education</label>
                <input className="field-input" type="text" name="education" value={profile.education} onChange={handleChange} placeholder="e.g. B.Tech Computer Science" />
                {errors.education && <p className="field-error">{errors.education}</p>}
              </div>
              <div className="field">
                <label className="field-label">Skills <span className="field-hint">(comma separated)</span></label>
                <input className="field-input" type="text" name="skills" value={profile.skills} onChange={handleChange} placeholder="e.g. React, Python, AWS" />
                {errors.skills && <p className="field-error">{errors.skills}</p>}
              </div>
              <div className="field">
                <label className="field-label">Current Job <span className="field-hint">(compulsory)</span></label>
                <input className="field-input" type="text" name="job" value={profile.job} onChange={handleChange} placeholder="e.g. Frontend Developer" />
                {errors.job && <p className="field-error">{errors.job}</p>}
              </div>
              <button type="submit" className="btn">Save Profile</button>
            </form>
          )}
        </div>

        {/* Stats Panel */}
        <div className="stats-panel">
          <div className="wastage-meter-card">
            <div className="wm-top">
              <span className="wm-label">SKILL WASTAGE INDEX</span>
              <span className="wm-value">67<span>%</span></span>
            </div>
            <div className="wm-track"><div className="wm-fill" style={{ width: "67%" }}><div className="wm-glow" /></div></div>
            <div className="wm-scale"><span>0%</span><span>Optimal</span><span>Critical</span><span>100%</span></div>
          </div>

          <div className="mini-stats">
            {[
              { label: "Active Skills",  val: "3/8",  color: "#3B82F6" },
              { label: "Wasted Skills",  val: "5",    color: "#ef4444" },
              { label: "Value Lost/yr",  val: "$28K", color: "#f59e0b" },
              { label: "Priority",       val: "HIGH", color: "#7c3aed" },
            ].map((s) => (
              <div className="mini-stat" key={s.label}>
                <span className="ms-val" style={{ color: s.color }}>{s.val}</span>
                <span className="ms-label">{s.label}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-outline" onClick={() => navigate("/upload")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload Resume for Deep Analysis
          </button>
        </div>
      </div>

      {/* ── SKILL INVENTORY ── */}
      <div className="section">
        <div className="section-head">
          <div className="section-title-wrap">
            <span className="sec-num">02</span>
            <h2 className="section-title">Skill Inventory</h2>
          </div>
          <div className="filter-tabs">
            {["all","active","underused","wasted"].map(f => (
              <button key={f} className={`ftab ${filter === f ? "ftab-active" : ""}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="skills-grid">
          {filtered.map((skill) => (
            <div key={skill.name} className={`skill-card sk-${skill.status}`}>
              <div className="sk-top">
                <span className="sk-name">{skill.name}</span>
                <span className={`sk-tag ${statusClass(skill.status)}`}>{statusLabel(skill.status)}</span>
              </div>
              <div className="sk-bars">
                <div className="sk-bar-row">
                  <span className="sk-bar-label">Proficiency</span>
                  <div className="sk-track"><div className="sk-fill sk-blue" style={{ width: `${skill.level}%` }} /></div>
                  <span className="sk-pct">{skill.level}%</span>
                </div>
                <div className="sk-bar-row">
                  <span className="sk-bar-label">Wastage</span>
                  <div className="sk-track">
                    <div
                      className={`sk-fill ${skill.wastage > 60 ? "sk-red" : skill.wastage > 30 ? "sk-gold" : "sk-green"}`}
                      style={{ width: `${skill.wastage}%` }}
                    />
                  </div>
                  <span className="sk-pct">{skill.wastage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI INSIGHTS ── */}
      <div className="section">
        <div className="section-head">
          <div className="section-title-wrap">
            <span className="sec-num">03</span>
            <h2 className="section-title">AI Insights</h2>
          </div>
          <span className="sk-tag tag-cyan" style={{ fontSize: "11px" }}>AI Generated</span>
        </div>

        <div className="insights-list">
          {[
            { type: "critical", icon: "⚠", title: "High-Value Skill Dormancy",    desc: "Machine Learning expertise (78%) is severely underutilized. Current role uses only 12% of ML potential.", impact: "HIGH" },
            { type: "warning",  icon: "◆", title: "Cloud Architecture Gap",        desc: "AWS Cloud skills unused for 8 months. Market demand increased 34% — risk of skill depreciation.",         impact: "MEDIUM" },
            { type: "info",     icon: "●", title: "Design Skills Suppressed",      desc: "UI/UX proficiency exceeds team average by 40%, yet not reflected in current responsibilities.",            impact: "MEDIUM" },
          ].map((ins) => (
            <div key={ins.title} className={`insight-card ins-${ins.type}`}>
              <span className={`ins-icon ins-${ins.type}`}>{ins.icon}</span>
              <div className="ins-body">
                <div className="ins-top">
                  <span className="ins-title">{ins.title}</span>
                  <span className={`impact-tag imp-${ins.type}`}>{ins.impact} IMPACT</span>
                </div>
                <p className="ins-desc">{ins.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Profile;