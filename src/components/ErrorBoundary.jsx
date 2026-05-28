import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div style={{
        minHeight: "100vh",
        background: "#eef4ff",
        padding: "110px 24px 40px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <div style={{
          maxWidth: 680,
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #fecaca",
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 18px 60px rgba(15,23,42,0.08)",
        }}>
          <p style={{ color: "#dc2626", fontWeight: 800, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Page loading problem
          </p>
          <h2 style={{ color: "#0f172a", fontSize: "1.35rem", marginBottom: 10 }}>
            This page could not open correctly.
          </h2>
          <p style={{ color: "#64748b", lineHeight: 1.6, marginBottom: 18 }}>
            Please refresh once. If it still appears, restart the frontend server and open the page again.
          </p>
          <div style={{
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            borderRadius: 12,
            padding: 14,
            color: "#9f1239",
            fontSize: "0.82rem",
            lineHeight: 1.5,
            wordBreak: "break-word",
          }}>
            {this.state.error?.message || "Unknown page error"}
          </div>
        </div>
      </div>
    );
  }
}
