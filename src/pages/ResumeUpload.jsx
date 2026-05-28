import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://127.0.0.1:8000";

function readProfile() {
  try {
    return JSON.parse(localStorage.getItem("userProfile") || "{}") || {};
  } catch {
    return {};
  }
}

function isProfileComplete(profile) {
  return [
    profile.name,
    profile.profession,
    profile.education,
    profile.skills,
    profile.job,
    profile.location,
    profile.about,
  ].every((value) => value && value.trim() !== "");
}

function buildProfileText(profile) {
  return [
    profile.name,
    profile.education,
    profile.skills,
    profile.job,
    profile.profession,
    profile.experience ? `${profile.experience} years experience` : "",
    profile.about,
  ].filter(Boolean).join(". ");
}

function buildCurrentRole(profile) {
  return [
    profile.job || profile.profession,
    profile.location ? `Location: ${profile.location}` : "",
    profile.about,
    profile.experience ? `Experience: ${profile.experience} years` : "",
  ].filter(Boolean).join(". ");
}

function fileSize(file) {
  if (!file) return "";
  return file.size > 1024 * 1024
    ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
    : `${(file.size / 1024).toFixed(1)} KB`;
}

export default function ResumeUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const profile = useMemo(readProfile, []);

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);

  const profileReady = isProfileComplete(profile);
  const skills = (profile.skills || "").split(",").map((skill) => skill.trim()).filter(Boolean);
  const currentRole = profile.job || profile.profession || "";
  const profileText = useMemo(() => buildProfileText(profile), [profile]);
  const currentRoleText = useMemo(() => buildCurrentRole(profile), [profile]);

  const actionText = !profileReady
    ? "Complete Profile First"
    : !file
      ? "Choose PDF First"
      : step === 1 || step === 2
        ? "Analyzing..."
        : "Analyze Skill Wastage";

  const steps = [
    { label: "Profile", done: profileReady, active: false },
    { label: "Resume", done: step >= 1, active: profileReady && step === 0 },
    { label: "Dashboard", done: step === 3, active: step >= 1 },
  ];

  const handleFile = (selectedFile) => {
    if (!profileReady) {
      setError("Please complete and save your profile before uploading a resume.");
      return;
    }
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF resume.");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Please upload a PDF below 10 MB.");
      return;
    }
    setError("");
    setReport(null);
    setStep(0);
    setFile(selectedFile);
  };

  const runAnalysis = async () => {
    if (!profileReady) {
      setError("Please complete and save your full profile before analysis.");
      return;
    }
    if (!file) {
      setError("Please choose your resume PDF first.");
      return;
    }

    setError("");
    setReport(null);
    setStep(1);

    try {
      const formData = new FormData();
      formData.append("firebase_uid", user?.uid || "demo-user");
      formData.append("file", file);

      const uploadResponse = await fetch(`${API_BASE}/upload-resume`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadData.detail || "Resume upload failed.");

      setStep(2);

      const analysisResponse = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebase_uid: user?.uid || "demo-user",
          resume_id: uploadData.resume_id,
          resume_text: uploadData.extracted_text,
          current_role: currentRoleText,
          profile_text: profileText,
          job_description: "",
        }),
      });
      const analysisData = await analysisResponse.json();
      if (!analysisResponse.ok) throw new Error(analysisData.detail || "Analysis failed.");

      const finalReport = {
        ...analysisData.dashboard_report,
        fileName: uploadData.file_name || file.name,
        resultId: analysisData.result_id,
        raw: analysisData,
      };

      localStorage.setItem("skillReport", JSON.stringify(finalReport));
      setReport(finalReport);
      setStep(3);
    } catch (err) {
      setStep(0);
      setError(err.message || "Analysis failed. Please check backend and MongoDB are running.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5fb", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .nav-btn { transition: all .2s; }
        .nav-btn:hover:not([disabled]) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(37,99,235,.35) !important;
        }
        .upload-drop { transition: all .2s; }
        .upload-drop:hover:not([disabled]) {
          border-color: #2563eb !important;
          background: #eff6ff !important;
        }
        @media(max-width:1024px){ .top-grid{ grid-template-columns:1fr !important; } }
      `}</style>

      <div style={{ background: "linear-gradient(135deg,#1a3a8f 0%,#2563eb 55%,#2dd4bf 100%)", paddingTop: 64 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 40px 56px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 10 }}>Step 2 of 3</p>
            <h1 style={{ fontSize: "clamp(1.8rem,3.5vw,2.7rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.03em", lineHeight: 1.15, marginBottom: 12 }}>
              Upload Your <span style={{ color: "#fbbf24" }}>Resume</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,.75)", fontSize: ".97rem", lineHeight: 1.6, maxWidth: 500 }}>
              Upload a PDF resume after completing your profile. The system will extract your skills and compare them with your current role.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            {steps.map((s, i) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, background: s.active ? "rgba(255,255,255,.22)" : s.done ? "rgba(34,197,94,.15)" : "rgba(255,255,255,.07)", border: `1px solid ${s.active ? "rgba(255,255,255,.4)" : s.done ? "rgba(34,197,94,.4)" : "rgba(255,255,255,.12)"}`, borderRadius: 24, padding: "7px 16px" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.done ? "#22c55e" : s.active ? "#fbbf24" : "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".72rem", fontWeight: 800, color: s.done ? "#fff" : s.active ? "#1a3a8f" : "rgba(255,255,255,.3)", flexShrink: 0 }}>
                  {s.done ? "OK" : i + 1}
                </div>
                <span style={{ color: s.done ? "#86efac" : s.active ? "#fff" : "rgba(255,255,255,.35)", fontSize: ".82rem", fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "32px 40px 64px" }}>
        <div className="top-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
          <div style={S.card}>
            <h2 style={S.cardTitle}>
              <span style={{ color: profileReady ? "#2563eb" : "#f59e0b" }}>{profileReady ? "PDF" : "LOCK"}</span>
              Resume Upload
            </h2>

            {error && (
              <div style={{ background: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3", borderRadius: 12, padding: "13px 15px", fontSize: ".84rem", fontWeight: 700, marginBottom: 18 }}>
                {error}
              </div>
            )}

            {step < 3 && (
              <div style={{ animation: "fadeUp .35s ease" }}>
                <button
                  type="button"
                  disabled={!profileReady}
                  className="upload-drop"
                  onClick={() => {
                    if (!profileReady) {
                      setError("Complete and save your profile first. Then resume upload will open.");
                      return;
                    }
                    fileRef.current?.click();
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFile(e.dataTransfer.files?.[0]);
                  }}
                  style={{
                    width: "100%",
                    minHeight: 280,
                    border: `2px dashed ${!profileReady ? "#cbd5e1" : dragging ? "#2563eb" : file ? "#22c55e" : "#bfdbfe"}`,
                    borderRadius: 16,
                    background: !profileReady ? "#f8fafc" : file ? "#f0fdf4" : "#f8faff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: profileReady ? "pointer" : "not-allowed",
                    opacity: profileReady ? 1 : 0.72,
                    padding: 28,
                    fontFamily: "inherit",
                  }}
                >
                  <input ref={fileRef} type="file" accept=".pdf" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
                  <div style={{ width: 70, height: 70, borderRadius: 18, background: file ? "#dcfce7" : "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: file ? "#16a34a" : "#2563eb", fontWeight: 800, marginBottom: 16 }}>
                    {!profileReady ? "LOCK" : file ? "PDF OK" : "PDF"}
                  </div>
                  <h3 style={{ color: "#0f172a", fontSize: "1.1rem", fontWeight: 800, marginBottom: 7 }}>
                    {!profileReady ? "Resume upload is locked" : file ? file.name : "Choose or drop your resume PDF"}
                  </h3>
                  <p style={{ color: "#64748b", fontSize: ".86rem", lineHeight: 1.55, textAlign: "center", maxWidth: 480, marginBottom: 12 }}>
                    {!profileReady
                      ? "Complete and save Profile first. After that you can upload your resume."
                      : file
                        ? `${fileSize(file)} selected. Click here to replace it.`
                        : "PDF upload supported. Maximum file size is 10 MB."}
                  </p>
                  <span style={{ padding: "9px 16px", borderRadius: 10, background: profileReady ? "#2563eb" : "#e2e8f0", color: profileReady ? "#fff" : "#64748b", fontWeight: 800, fontSize: ".82rem" }}>
                    {profileReady ? "Browse Resume" : "Complete Profile First"}
                  </span>
                </button>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
                  <button type="button" className="nav-btn" onClick={() => navigate("/profile")} style={S.btnOutline}>
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className="nav-btn"
                    disabled={!profileReady || !file || step === 1 || step === 2}
                    onClick={runAnalysis}
                    style={{ ...S.btnPrimary, cursor: !profileReady || !file || step === 1 || step === 2 ? "not-allowed" : "pointer", background: !profileReady || !file || step === 1 || step === 2 ? "#94a3b8" : S.btnPrimary.background }}
                  >
                    {actionText}
                  </button>
                </div>

                {(step === 1 || step === 2) && (
                  <div style={{ marginTop: 18, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ width: 28, height: 28, border: "3px solid #bfdbfe", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin .8s linear infinite", flexShrink: 0 }} />
                    <p style={{ color: "#334155", fontSize: ".84rem", fontWeight: 700, margin: 0 }}>
                      {step === 1 ? "Reading resume text..." : "Comparing resume skills with current role..."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 3 && report && (
              <div style={{ animation: "fadeUp .35s ease" }}>
                <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 14, padding: 18, marginBottom: 18 }}>
                  <p style={{ color: "#16a34a", fontSize: ".78rem", fontWeight: 800, marginBottom: 5 }}>Analysis Complete</p>
                  <h3 style={{ color: "#0f172a", fontSize: "1.05rem", marginBottom: 4 }}>{report.fileName}</h3>
                  <p style={{ color: "#64748b", fontSize: ".84rem" }}>Your skill wastage dashboard is ready.</p>
                </div>
                <button type="button" className="nav-btn" onClick={() => navigate("/dashboard")} style={S.btnPrimary}>
                  Open Dashboard
                </button>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "linear-gradient(135deg,#1e3a5f,#1a3a8f)", borderRadius: 18, padding: "22px 20px", boxShadow: "0 4px 20px rgba(26,58,143,.22)" }}>
              <p style={{ color: "rgba(255,255,255,.5)", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>Current Status</p>
              <div style={{ background: "rgba(255,255,255,.07)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(255,255,255,.1)" }}>
                <p style={{ color: profileReady ? "#86efac" : "#fbbf24", fontSize: ".82rem", fontWeight: 700, margin: 0, lineHeight: 1.5 }}>
                  {profileReady ? "Profile complete. Resume upload is open." : "Profile incomplete. Resume upload is locked."}
                </p>
              </div>
            </div>

            <div style={{ ...S.card, padding: 20 }}>
              <p style={{ fontSize: ".72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Profile used for analysis</p>
              <h3 style={{ color: "#0f172a", fontSize: ".98rem", marginBottom: 6 }}>{currentRole || "Current role missing"}</h3>
              <p style={{ color: "#64748b", fontSize: ".78rem", lineHeight: 1.5, marginBottom: 13 }}>
                {profileReady ? "Your resume will be compared with this current occupation." : "Fill all profile fields before uploading resume."}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {skills.slice(0, 10).map((skill) => (
                  <span key={skill} style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 999, padding: "5px 10px", fontSize: ".72rem", fontWeight: 700 }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ ...S.card, padding: 20 }}>
              <p style={{ fontSize: ".72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>What happens next</p>
              {[
                "Resume text extraction",
                "Skill matching with profile",
                "Skill wastage score",
                "Dashboard and recommendations",
              ].map((item, index) => (
                <div key={item} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: index < 3 ? "1px solid #f1f5f9" : "none", alignItems: "center" }}>
                  <span style={{ width: 24, height: 24, borderRadius: 8, background: "#eff6ff", color: "#2563eb", display: "grid", placeItems: "center", fontSize: ".7rem", fontWeight: 800 }}>{index + 1}</span>
                  <span style={{ color: "#334155", fontSize: ".8rem", fontWeight: 700 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 26, boxShadow: "0 2px 12px rgba(0,0,0,.05)" },
  cardTitle: { fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: 22, display: "flex", alignItems: "center", gap: 8 },
  btnPrimary: { padding: "12px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", fontFamily: "inherit", fontSize: ".9rem", fontWeight: 700, boxShadow: "0 4px 14px rgba(37,99,235,.28)" },
  btnOutline: { padding: "11px 22px", borderRadius: 10, border: "1.5px solid #2563eb", cursor: "pointer", background: "#fff", color: "#2563eb", fontFamily: "inherit", fontSize: ".85rem", fontWeight: 600 },
};
