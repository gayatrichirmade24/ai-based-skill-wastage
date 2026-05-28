import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://127.0.0.1:8000";

function scoreLabel(score) {
  if (score <= 30) return { text: "Good", color: "#16a34a", bg: "#dcfce7", border: "#86efac" };
  if (score <= 60) return { text: "Moderate", color: "#a16207", bg: "#fef9c3", border: "#fde68a" };
  return { text: "High Wastage", color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" };
}

function fitLabel(score) {
  if (score >= 80) return { text: "Strong Match", color: "#16a34a" };
  if (score >= 55) return { text: "Medium Match", color: "#d97706" };
  return { text: "Weak Match", color: "#dc2626" };
}

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      if (!user?.uid) return;
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE}/history/${user.uid}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Could not load analysis history.");
        setItems(data.results || []);
      } catch (err) {
        setError(err.message || "Could not load analysis history.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [user?.uid]);

  const openReport = (item) => {
    const report = {
      ...item.dashboard_report,
      resultId: item._id,
      raw: item,
    };
    localStorage.setItem("skillReport", JSON.stringify(report));
    navigate("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5fb", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg,#1a3a8f 0%,#2563eb 55%,#2dd4bf 100%)", paddingTop: 64 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 40px 56px" }}>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 10 }}>Analysis History</p>
          <h1 style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 800, color: "#fff", marginBottom: 8 }}>Your Previous Skill Reports</h1>
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: ".95rem", maxWidth: 560, lineHeight: 1.6 }}>
            Review past resume analyses, compare role utilization scores, and reopen any report on the dashboard.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 40px 70px" }}>
        {loading && <div style={S.emptyCard}>Loading your analysis history...</div>}
        {error && <div style={{ ...S.emptyCard, color: "#dc2626", borderColor: "#fca5a5", background: "#fff7f7" }}>{error}</div>}

        {!loading && !error && items.length === 0 && (
          <div style={S.emptyCard}>
            <h2 style={{ margin: "0 0 8px", fontSize: "1.1rem", color: "#0f172a" }}>No history yet</h2>
            <p style={{ margin: "0 0 18px", color: "#64748b", lineHeight: 1.6 }}>Upload a resume and run analysis once. Your reports will appear here automatically.</p>
            <button onClick={() => navigate("/upload")} style={S.primaryBtn}>Analyze Resume</button>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div style={{ display: "grid", gap: 14 }}>
            {items.map((item) => {
              const wastage = Number(item.skill_wastage_score || item.dashboard_report?.wastageIndex || 0);
              const fit = Number(item.job_fit_score || 0);
              const w = scoreLabel(wastage);
              const f = fitLabel(fit);
              const date = item.created_at ? new Date(item.created_at).toLocaleString() : "Recent analysis";

              return (
                <div key={item._id} style={S.rowCard}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <p style={{ fontSize: ".72rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", margin: "0 0 6px" }}>{date}</p>
                    <h3 style={{ margin: "0 0 8px", fontSize: "1rem", color: "#0f172a" }}>{item.dashboard_report?.fileName || "Uploaded Resume"}</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {(item.matched_skills || []).slice(0, 6).map((skill) => <span key={skill} style={S.skillPill}>{skill}</span>)}
                    </div>
                  </div>

                  <div style={S.metricBox}>
                    <strong style={{ color: w.color, fontSize: "1.35rem" }}>{wastage}%</strong>
                    <span style={{ ...S.badge, color: w.color, background: w.bg, borderColor: w.border }}>{w.text}</span>
                  </div>

                  <div style={S.metricBox}>
                    <strong style={{ color: f.color, fontSize: "1.35rem" }}>{fit}%</strong>
                    <span style={{ fontSize: ".72rem", color: f.color, fontWeight: 700 }}>{f.text}</span>
                  </div>

                  <button onClick={() => openReport(item)} style={S.primaryBtn}>View Report</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  emptyCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 28, color: "#64748b", boxShadow: "0 2px 8px rgba(0,0,0,.04)" },
  rowCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,.04)", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" },
  skillPill: { fontSize: ".72rem", color: "#1d4ed8", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "4px 10px", borderRadius: 999 },
  metricBox: { minWidth: 120, display: "flex", flexDirection: "column", gap: 4 },
  badge: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "fit-content", border: "1px solid", borderRadius: 999, padding: "3px 9px", fontSize: ".68rem", fontWeight: 800 },
  primaryBtn: { border: "none", borderRadius: 10, background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", padding: "11px 18px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,.24)" },
};
