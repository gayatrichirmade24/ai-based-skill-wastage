import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/style.css";

const STEPS = ["Upload", "Parsing", "Analyzing", "Results"];

const RESULTS = {
  score: 74,
  skills_found: 12,
  active: 3,
  underused: 4,
  wasted: 5,
  top_wasted: [
    { name: "Machine Learning", pct: 90 },
    { name: "Cloud Architecture", pct: 82 },
    { name: "GraphQL",            pct: 74 },
    { name: "Docker",             pct: 66 },
    { name: "Kubernetes",         pct: 58 },
  ],
  roles: [
    { role: "ML Engineer",      match: 84, jobs: 1240 },
    { role: "Full Stack + AI",  match: 78, jobs: 890  },
    { role: "Cloud Architect",  match: 71, jobs: 650  },
  ],
  recs: [
    "Transition to ML Engineer role — 78% skill match found in job market",
    "Add cloud-focused side projects to maintain AWS certification value",
    "Build a GraphQL portfolio project — recovers 32% of underutilized skill value",
  ],
};

function ResumeUpload() {
  const navigate = useNavigate();
  const [step, setStep]             = useState(0);
  const [file, setFile]             = useState(null);
  const [dragOver, setDragOver]     = useState(false);
  const [progress, setProgress]     = useState(0);
  const [phaseIdx, setPhaseIdx]     = useState(0);

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const acceptFile = (f) => {
    if (!f) return;
    const ok = ["application/pdf","application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain"];
    if (!ok.includes(f.type) && !f.name.match(/\.(pdf|doc|docx|txt)$/i)) {
      toast.error("Only PDF, DOC, DOCX, or TXT files allowed!"); return;
    }
    if (f.size > MAX_SIZE) { toast.error("File must be under 10MB!"); return; }
    setFile(f);
    runParsing();
  };

  const runParsing = () => {
    setStep(1); setProgress(0);
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) { clearInterval(t); setProgress(100); setTimeout(runAnalysis, 500); return; }
      setProgress(p);
    }, 200);
  };

  const runAnalysis = () => {
    setStep(2); setProgress(0); setPhaseIdx(0);
    let p = 0, ph = 0;
    const t = setInterval(() => {
      p += Math.random() * 9;
      const newPh = Math.min(Math.floor(p / 20), 4);
      if (newPh !== ph) { ph = newPh; setPhaseIdx(newPh); }
      if (p >= 100) { clearInterval(t); setProgress(100); setTimeout(() => setStep(3), 600); return; }
      setProgress(p);
    }, 180);
  };

  const reset = () => { setStep(0); setFile(null); setProgress(0); setPhaseIdx(0); };

  const PHASES = [
    "Extracting skill entities...",
    "Cross-referencing job market data...",
    "Computing wastage coefficients...",
    "Generating career recommendations...",
    "Finalizing report...",
  ];

  return (
    <div className="ru-page">

      {/* ── PAGE HEADER ── */}
      <div className="ph-header">
        <div>
          <p className="ph-eyebrow">Resume Upload</p>
          <h1 className="ph-title">Detect Your<span className="ph-accent"> Invisible</span> Skill Wastage</h1>
          <p className="ph-desc">Upload your resume and our AI will map every skill, quantify wastage, and surface hidden career opportunities in seconds.</p>
        </div>
        <div className="feature-pills">
          {["NLP Parsing","Market Data","AI Scoring","Career Match"].map(p => (
            <span key={p} className="feature-pill">{p}</span>
          ))}
        </div>
      </div>

      {/* ── STEP INDICATOR ── */}
      <div className="step-indicator">
        {STEPS.map((s, i) => (
          <div key={s} className={`step-item ${i === step ? "si-active" : i < step ? "si-done" : ""}`}>
            <div className="si-circle">
              {i < step
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : <span>{i + 1}</span>}
            </div>
            <span className="si-label">{s}</span>
            {i < STEPS.length - 1 && <div className={`si-line ${i < step ? "si-line-done" : ""}`} />}
          </div>
        ))}
      </div>

      {/* ── STEP 0: UPLOAD ── */}
      {step === 0 && (
        <div className="upload-layout">
          <div
            className={`drop-zone ${dragOver ? "dz-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); acceptFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById("ru-file-input").click()}
          >
            <input id="ru-file-input" type="file" accept=".pdf,.doc,.docx,.txt"
              style={{ display: "none" }} onChange={(e) => acceptFile(e.target.files[0])} />

            <div className="dz-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <h3 className="dz-title">Drop your resume here</h3>
            <p className="dz-sub">or <span className="dz-link">browse files</span></p>
            <div className="dz-formats">
              {["PDF","DOC","DOCX","TXT"].map(f => <span key={f} className="fmt-tag">{f}</span>)}
            </div>
            <p className="dz-limit">Max 10MB</p>
          </div>

          <div className="upload-features">
            {[
              { icon: "🔒", title: "Private & Secure",   desc: "Processed in-memory, never stored on our servers" },
              { icon: "⚡", title: "30-Second Analysis", desc: "Full skill mapping and wastage report in under 30s" },
              { icon: "🎯", title: "98% Accuracy",       desc: "NLP model trained on 50,000+ resumes and job listings" },
            ].map((f) => (
              <div key={f.title} className="uf-card">
                <span className="uf-icon">{f.icon}</span>
                <div><p className="uf-title">{f.title}</p><p className="uf-desc">{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 1: PARSING ── */}
      {step === 1 && (
        <div className="proc-wrap">
          <div className="proc-card">
            <div className="proc-rings">
              <div className="pr pr-1" /><div className="pr pr-2" />
              <div className="proc-icon-inner">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
            </div>
            <h3 className="proc-title">Parsing Resume</h3>
            <p className="proc-sub">Reading <strong>{file?.name}</strong></p>
            <div className="proc-bar-wrap">
              <div className="proc-track"><div className="proc-fill" style={{ width: `${progress}%` }} /></div>
              <span className="proc-pct">{Math.round(progress)}%</span>
            </div>
            <div className="proc-log">
              {["Reading document structure...","Tokenizing content...","Identifying sections..."].map((l,i) => (
                <div key={i} className="log-line" style={{ animationDelay: `${i*0.5}s` }}>
                  <span style={{ color: "#4a5568" }}>&gt;_</span> {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: ANALYZING ── */}
      {step === 2 && (
        <div className="proc-wrap">
          <div className="proc-card">
            <div className="proc-rings">
              <div className="pr pr-1 pr-purple" /><div className="pr pr-2 pr-purple" />
              <div className="proc-icon-inner proc-icon-purple">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
            </div>
            <h3 className="proc-title">AI Analysis Running</h3>
            <p className="proc-sub">Deep scanning {RESULTS.skills_found} skills detected</p>
            <div className="proc-bar-wrap">
              <div className="proc-track"><div className="proc-fill proc-fill-purple" style={{ width: `${progress}%` }} /></div>
              <span className="proc-pct">{Math.round(progress)}%</span>
            </div>
            <div className="phase-list">
              {PHASES.map((ph, i) => (
                <div key={i} className={`phase-item ${i === phaseIdx ? "ph-active" : i < phaseIdx ? "ph-done" : ""}`}>
                  <span className="ph-dot">{i < phaseIdx ? "✓" : i === phaseIdx ? "▶" : "○"}</span>
                  {ph}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: RESULTS ── */}
      {step === 3 && (
        <div className="results-wrap">
          <div className="res-header">
            <div className="res-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Analysis Complete
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn btn-outline btn-sm" onClick={reset}>↺ New Upload</button>
              <button className="btn btn-sm" onClick={() => toast.success("Report downloaded!")}>↓ Download Report</button>
            </div>
          </div>

          {/* Score Row */}
          <div className="score-row">
            <div className="score-ring-wrap">
              <svg viewBox="0 0 120 120" width="150" height="150">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#1e2d3d" strokeWidth="8"/>
                <circle cx="60" cy="60" r="52" fill="none" stroke="url(#sg)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(RESULTS.score / 100) * 326.7} 326.7`}
                  transform="rotate(-90 60 60)" />
                <defs>
                  <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#ef4444"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="score-inner-text">
                <span className="score-big">{RESULTS.score}</span>
                <span className="score-small-label">Wastage %</span>
              </div>
            </div>

            <div className="score-meta">
              <h2 className="score-title">Skill Wastage Report</h2>
              <p className="score-file">{file?.name || "resume.pdf"}</p>
              <div className="score-stats-row">
                {[
                  { label: "Skills Found", val: RESULTS.skills_found, color: "#00e5ff" },
                  { label: "Active",       val: RESULTS.active,       color: "#10b981" },
                  { label: "Underused",    val: RESULTS.underused,    color: "#f59e0b" },
                  { label: "Wasted",       val: RESULTS.wasted,       color: "#ef4444" },
                ].map(s => (
                  <div key={s.label} className="ss-item">
                    <span className="ss-val" style={{ color: s.color }}>{s.val}</span>
                    <span className="ss-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="res-grid">
            {/* Wasted Skills */}
            <div className="res-card">
              <div className="rc-head">
                <span className="rc-title"><span style={{ color:"#ef4444" }}>⚠ </span>Wasted Skills</span>
                <span className="sk-tag tag-red">{RESULTS.wasted} Found</span>
              </div>
              {RESULTS.top_wasted.map((s, i) => (
                <div key={s.name} className="tw-row">
                  <span className="tw-rank">#{i+1}</span>
                  <span className="tw-name">{s.name}</span>
                  <div className="tw-track"><div className="tw-fill" style={{ width: `${s.pct}%` }} /></div>
                  <span className="tw-pct">{s.pct}%</span>
                </div>
              ))}
            </div>

            {/* Role Matches */}
            <div className="res-card">
              <div className="rc-head">
                <span className="rc-title"><span style={{ color:"#10b981" }}>◆ </span>Best Role Matches</span>
                <span className="sk-tag tag-green">AI Suggested</span>
              </div>
              {RESULTS.roles.map(r => (
                <div key={r.role} className="role-item">
                  <div className="ri-top"><span className="ri-name">{r.role}</span><span className="ri-match">{r.match}% match</span></div>
                  <div className="ri-track"><div className="ri-fill" style={{ width: `${r.match}%` }} /></div>
                  <span className="ri-jobs">{r.jobs.toLocaleString()} companies hiring</span>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="res-card res-full">
              <div className="rc-head">
                <span className="rc-title"><span style={{ color:"#00e5ff" }}>● </span>AI Recommendations</span>
              </div>
              {RESULTS.recs.map((r, i) => (
                <div key={i} className="rec-row">
                  <span className="rec-num">{String(i+1).padStart(2,"0")}</span>
                  <p className="rec-text">{r}</p>
                  <button className="rec-btn" onClick={() => toast.info("Opening opportunities...")}>Explore →</button>
                </div>
              ))}
            </div>
          </div>

          <div className="res-footer">
            <button className="btn btn-outline" onClick={() => navigate("/")}>← View Profile</button>
            <span className="res-id">Report ID: SKL-{Math.random().toString(36).substr(2,8).toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;