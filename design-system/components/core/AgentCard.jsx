import React from "react";
import { Pill } from "./Chips.jsx";
import { Arrows } from "./Arrows.jsx";
const ICONS = {
  fixer: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  debugger: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-5-5" /></>,
  pipelines: <><circle cx="4" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="20" cy="12" r="2" /><path d="M6 12h4M14 12h4" /></>,
};
/** .agent — dark raised card for one agent */
export function AgentCard({ icon = "fixer", pill, name, role, summary, items = [], style }) {
  return (
    <article style={{ display: "flex", flexDirection: "column", gap: 16, padding: 32, background: "var(--ink-raised)", border: "1px solid var(--ink-line)", borderRadius: 12, color: "var(--on-ink)", fontFamily: "var(--font-sans)", ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span aria-hidden="true" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, color: "var(--accent)", background: "var(--ink)", border: "1px solid var(--ink-line-strong)", borderRadius: 10 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{ICONS[icon] || ICONS.fixer}</svg>
        </span>
        {pill && <Pill>{pill}</Pill>}
      </div>
      <div>
        <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.75rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}>{name}</h3>
        <p style={{ margin: "4px 0 0", color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>{role}</p>
      </div>
      <p style={{ margin: 0, color: "var(--on-ink-muted)", textWrap: "pretty" }}>{summary}</p>
      <Arrows items={items} onDark gap={8} style={{ paddingTop: 16, borderTop: "1px solid var(--ink-line)", fontSize: "1rem" }} />
    </article>
  );
}
