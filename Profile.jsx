import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PROFESSIONS = [
  "Engineer", "Doctor", "Teacher", "Lawyer", "Student",
  "Designer", "Business Owner", "Freelancer", "Researcher", "Other"
];

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.displayName || "",
    profession: "",
    education: "",
    experience: "",
    skills: "",
    job: "",
    location: "",
    about: ""
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved]   = useState(false);
  const [toast, setToast]   = useState(null);

  /* ── Completion bar ── */
  const completionFields = [
    profile.name, profile.profession, profile.education,
    profile.skills, profile.job, profile.location, profile.about
  ];
  const completion = Math.round(
    (completionFields.filter(v => v && v.trim() !== "").length / completionFields.length) * 100
  );

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validate = () => {
    const e = {};
    if (profile.name.trim().length < 3)  e.name      = "Name must be at least 3 characters";
    if (!profile.profession)             e.profession = "Profession is required";
    if (!profile.education)              e.education  = "Education is required";
    if (!profile.skills.trim())          e.skills     = "Enter at least one skill";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      try { localStorage.setItem("userProfile", JSON.stringify(profile)); } catch (_) {}
      showToast("Profile saved! Continue to the Resume page.");
      setSaved(true);
    }
  };

  /* ── Step tracker ── */
  const steps = [
    { label: "Profile",   done: saved,  active: !saved },
    { label: "Resume",    done: false,  active: saved  },
    { label: "Dashboard", done: false,  active: false  },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5fb", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        input:focus, select:focus, textarea:focus {
          border-color:#2563eb !important;
          box-shadow:0 0 0 3px rgba(37,99,235,.1) !important;
          outline:none;
        }
        .nav-btn { transition: all .2s; }
        .nav-btn:hover:not([disabled]) {
          transform:translateY(-1px);
          box-shadow:0 8px 20px rgba(37,99,235,.35) !important;
        }
        @media(max-width:1024px){ .top-grid{ grid-template-columns:1fr !important; } }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(135deg,#1a3a8f 0%,#2563eb 55%,#2dd4bf 100%)", paddingTop: 64 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 40px 56px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 10 }}>Step 1 of 3</p>
            <h1 style={{ fontSize: "clamp(1.8rem,3.5vw,2.7rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.03em", lineHeight: 1.15, marginBottom: 12 }}>
              Create Your <span style={{ color: "#fbbf24" }}>Profile</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,.75)", fontSize: ".97rem", lineHeight: 1.6, maxWidth: 460 }}>
              Tell us about yourself. Once saved, head to the Resume page to start your AI skill analysis.
            </p>
          </div>

          {/* Step pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            {steps.map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, background: s.active ? "rgba(255,255,255,.22)" : s.done ? "rgba(34,197,94,.15)" : "rgba(255,255,255,.07)", border: `1px solid ${s.active ? "rgba(255,255,255,.4)" : s.done ? "rgba(34,197,94,.4)" : "rgba(255,255,255,.12)"}`, borderRadius: 24, padding: "7px 16px" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.done ? "#22c55e" : s.active ? "#fbbf24" : "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".72rem", fontWeight: 800, color: s.done ? "#fff" : s.active ? "#1a3a8f" : "rgba(255,255,255,.3)", flexShrink: 0 }}>
                  {s.done ? "✓" : i + 1}
                </div>
                <span style={{ color: s.done ? "#86efac" : s.active ? "#fff" : "rgba(255,255,255,.35)", fontSize: ".82rem", fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "32px 40px 64px" }}>
        <div className="top-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

          {/* ── FORM CARD ── */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>
              {saved
                ? <><span style={{ color: "#16a34a" }}>✓</span> Profile Saved</>
                : <><span style={{ color: "#2563eb" }}>◆</span> Complete Your Profile</>}
            </h2>

            {/* Completion bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: ".75rem", color: "#64748b" }}>Profile Completion</span>
                <span style={{ fontSize: ".75rem", fontWeight: 700, color: completion === 100 ? "#16a34a" : "#2563eb" }}>{completion}%</span>
              </div>
              <div style={{ height: 6, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${completion}%`, height: "100%", background: completion === 100 ? "linear-gradient(90deg,#22c55e,#16a34a)" : "linear-gradient(90deg,#2563eb,#3b82f6)", transition: "width .4s" }} />
              </div>
            </div>

            {/* Saved view */}
            {saved ? (
              <div style={{ animation: "fadeUp .35s ease" }}>
                {[
                  ["Name",       profile.name],
                  ["Profession", profile.profession],
                  ["Role",       profile.job],
                  ["Education",  profile.education],
                  ["Experience", profile.experience ? `${profile.experience} years` : "—"],
                  ["Skills",     profile.skills],
                  ["Location",   profile.location],
                  ["About",      profile.about],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", gap: 16, padding: "13px 0", borderBottom: "1px solid #f1f5f9", alignItems: "flex-start" }}>
                    <span style={{ color: "#94a3b8", fontSize: ".8rem", width: 96, flexShrink: 0, paddingTop: 1 }}>{l}</span>
                    <span style={{ color: "#0f172a", fontSize: ".9rem", fontWeight: 500, lineHeight: 1.5, flex: 1 }}>{v || "—"}</span>
                  </div>
                ))}
                <button style={{ ...S.btnOutline, marginTop: 20 }} onClick={() => setSaved(false)}>✎ Edit Profile</button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} style={{ animation: "fadeUp .35s ease" }}>
                <Row label="Full Name" error={errors.name}>
                  <input style={S.input} type="text" value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    placeholder="e.g. Arjun Sharma" />
                </Row>
                <Row label="Profession" error={errors.profession}>
                  <select style={S.input} value={profile.profession}
                    onChange={e => setProfile({ ...profile, profession: e.target.value })}>
                    <option value="">Select Profession</option>
                    {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Row>
                <Row label="Current Role">
                  <input style={S.input} type="text" value={profile.job}
                    onChange={e => setProfile({ ...profile, job: e.target.value })}
                    placeholder="e.g. Frontend Developer" />
                </Row>
                <Row label="Education" error={errors.education}>
                  <input style={S.input} type="text" value={profile.education}
                    onChange={e => setProfile({ ...profile, education: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science" />
                </Row>
                <Row label="Years of Experience">
                  <input style={S.input} type="number" min="0" value={profile.experience}
                    onChange={e => setProfile({ ...profile, experience: e.target.value })}
                    placeholder="e.g. 3" />
                </Row>
                <Row label="Skills (comma separated)" error={errors.skills}>
                  <input style={S.input} type="text" value={profile.skills}
                    onChange={e => setProfile({ ...profile, skills: e.target.value })}
                    placeholder="e.g. React, Python, AWS" />
                </Row>
                <Row label="Location">
                  <input style={S.input} type="text" value={profile.location}
                    onChange={e => setProfile({ ...profile, location: e.target.value })}
                    placeholder="City, Country" />
                </Row>
                <Row label="About Yourself">
                  <textarea style={{ ...S.input, minHeight: 80, resize: "vertical" }}
                    value={profile.about}
                    onChange={e => setProfile({ ...profile, about: e.target.value })}
                    placeholder="Brief description about your professional background" />
                </Row>
                <button type="submit" style={S.btnPrimary}>Save Profile →</button>
              </form>
            )}
          </div>

          {/* ── RIGHT PANEL — navigation only, zero upload UI ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Step Navigator */}
            <div style={{ background: "linear-gradient(135deg,#1e3a5f,#1a3a8f)", borderRadius: 18, padding: "22px 20px", boxShadow: "0 4px 20px rgba(26,58,143,.22)" }}>
              <p style={{ color: "rgba(255,255,255,.5)", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>Your Progress</p>

              {/* Step tracker */}
              <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
                {steps.map((s, i) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "unset" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: s.done ? "#22c55e" : s.active ? "#fbbf24" : "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".72rem", fontWeight: 800, color: s.done ? "#fff" : s.active ? "#1a3a8f" : "rgba(255,255,255,.25)" }}>
                        {s.done ? "✓" : i + 1}
                      </div>
                      <span style={{ fontSize: ".63rem", fontWeight: 600, color: s.done ? "#86efac" : s.active ? "#fbbf24" : "rgba(255,255,255,.25)", whiteSpace: "nowrap" }}>{s.label}</span>
                    </div>
                    {i < 2 && <div style={{ flex: 1, height: 2, background: s.done ? "#22c55e" : "rgba(255,255,255,.1)", marginBottom: 22, borderRadius: 2 }} />}
                  </div>
                ))}
              </div>

              {/* Status */}
              <div style={{ background: "rgba(255,255,255,.07)", borderRadius: 10, padding: "12px 14px", marginBottom: 16, border: "1px solid rgba(255,255,255,.1)" }}>
                <p style={{ color: saved ? "#86efac" : "#fbbf24", fontSize: ".82rem", fontWeight: 700, margin: 0, lineHeight: 1.5 }}>
                  {saved
                    ? "✓ Profile complete! Proceed to the Resume page."
                    : "⬅ Fill and save your profile to continue."}
                </p>
              </div>

              {/* Navigate to /upload — this button does NOT upload anything */}
              <button
                className="nav-btn"
                disabled={!saved}
                onClick={() => navigate("/upload")}
                style={{ width: "100%", padding: "12px 20px", borderRadius: 10, border: "none", cursor: saved ? "pointer" : "not-allowed", background: saved ? "linear-gradient(135deg,#2563eb,#3b82f6)" : "rgba(255,255,255,.08)", color: saved ? "#fff" : "rgba(255,255,255,.3)", fontFamily: "inherit", fontSize: ".88rem", fontWeight: 700, transition: "all .2s" }}>
                {saved ? "Go to Resume Page →" : "🔒 Complete Profile First"}
              </button>
            </div>

            {/* What happens on the Resume page */}
            <div style={{ ...S.card, padding: "20px" }}>
              <p style={{ fontSize: ".72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>On the Resume page</p>
              {[
                { icon: "📄", title: "Upload your resume",        desc: "PDF, DOC, DOCX or TXT — all supported."          },
                { icon: "🔍", title: "NLP skill extraction",      desc: "AI reads and extracts every skill automatically." },
                { icon: "📊", title: "Market demand comparison",  desc: "Your skills matched against live job data."       },
                { icon: "🤖", title: "AI risk & wastage scoring", desc: "See automation risk and skill gaps instantly."    },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: i < 3 ? "1px solid #f1f5f9" : "none", alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".95rem", flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontSize: ".82rem", fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{item.title}</p>
                    <p style={{ fontSize: ".74rem", color: "#64748b", lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Completion tip */}
            {!saved && completion < 100 && (
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "13px 15px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: ".95rem", flexShrink: 0 }}>💡</span>
                <p style={{ fontSize: ".77rem", color: "#92400e", lineHeight: 1.5, margin: 0 }}>
                  <strong>Tip:</strong> A complete profile helps AI give more accurate recommendations. {100 - completion}% left!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, padding: "14px 22px", borderRadius: 12, fontSize: ".88rem", fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.15)", background: toast.type === "success" ? "#dcfce7" : "#fee2e2", color: toast.type === "success" ? "#16a34a" : "#dc2626", border: `1px solid ${toast.type === "success" ? "#86efac" : "#fca5a5"}`, animation: "fadeUp .3s ease" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function Row({ label, error, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={S.label}>{label}</label>
      {children}
      {error && <p style={{ color: "#dc2626", fontSize: ".75rem", marginTop: 4 }}>{error}</p>}
    </div>
  );
}

const S = {
  card:       { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: "26px", boxShadow: "0 2px 12px rgba(0,0,0,.05)" },
  cardTitle:  { fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: 22, display: "flex", alignItems: "center", gap: 7 },
  label:      { display: "block", fontSize: ".82rem", fontWeight: 600, color: "#334155", marginBottom: 7 },
  input:      { width: "100%", padding: "11px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontFamily: "inherit", fontSize: ".9rem", color: "#0f172a", background: "#f8faff", transition: "all .2s", boxSizing: "border-box" },
  btnPrimary: { padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", fontFamily: "inherit", fontSize: ".9rem", fontWeight: 700, boxShadow: "0 4px 14px rgba(37,99,235,.28)" },
  btnOutline: { padding: "11px 22px", borderRadius: 10, border: "1.5px solid #2563eb", cursor: "pointer", background: "#fff", color: "#2563eb", fontFamily: "inherit", fontSize: ".85rem", fontWeight: 600 },
};