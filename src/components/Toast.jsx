import { useState, useEffect } from "react";

let toastCallback = null;

export function showToast(msg, type = "success") {
  if (toastCallback) toastCallback(msg, type);
}

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    toastCallback = (msg, type) => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3500);
    };
    return () => { toastCallback = null; };
  }, []);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      padding: "14px 22px", borderRadius: 12, fontSize: "0.88rem", fontWeight: 600,
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      background: isSuccess ? "#dcfce7" : "#fee2e2",
      color: isSuccess ? "#16a34a" : "#dc2626",
      border: `1px solid ${isSuccess ? "#86efac" : "#fca5a5"}`,
      animation: "fadeUp 0.35s cubic-bezier(.34,1.56,.64,1)",
      maxWidth: 320,
    }}>
      {toast.msg}
    </div>
  );
}