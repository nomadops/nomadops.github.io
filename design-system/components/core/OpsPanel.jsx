import React from "react";
import { Dot } from "./Chips.jsx";
/** .feature-media.mock-light — operations panel mock. */
export function OpsPanel({ app = "your-app", section = "Operations", meta = "Admin only", groups = [], style }) {
  const mockBtn = (accent) => ({ display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 16px", background: accent ? "var(--accent)" : "var(--ink)", borderRadius: 6, color: accent ? "var(--ink)" : "var(--on-ink)", fontSize: "0.9375rem", fontWeight: 600 });
  return (
    <figure style={{ margin: 0, overflow: "hidden", borderRadius: 12, background: "var(--paper)", border: "1px solid var(--line)", color: "var(--text)", fontFamily: "var(--font-sans)", lineHeight: 1.6, ...style }}>
      <figcaption style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 20px", background: "var(--paper-tint)", borderBottom: "1px solid var(--line)" }}>
        <span><strong>{app}</strong> / {section}</span><span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--text-muted)" }}>{meta}</span>
      </figcaption>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 20 }}>
        {groups.map((g) => (
          <div key={g.label}>
            <p style={{ margin: "0 0 8px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.8125rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>{g.label}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", border: "1px solid var(--line)", borderRadius: 8 }}>
              {g.rows.map((r, i) => (
                <li key={i} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px 12px", minHeight: 60, padding: "8px 8px 8px 16px", borderBottom: i < g.rows.length - 1 ? "1px solid var(--line)" : 0 }}>
                  <span>{r.label}{r.meta && <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.875rem" }}>{r.meta}</span>}</span>
                  <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, fontSize: "0.9375rem" }}>
                    {r.status && <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Dot tone={r.tone || "ok"} />{r.status}</span>}
                    {r.action && <span style={mockBtn(r.accent)}>{r.action}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </figure>
  );
}
