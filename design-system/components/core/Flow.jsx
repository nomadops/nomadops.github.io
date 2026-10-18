import React from "react";
/** .flow — approval flow steps joined by chevrons; the "human" step is orange. */
export function Flow({ steps = [], style }) {
  return (
    <ol style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, margin: "40px 0 56px", padding: 0, listStyle: "none", color: "var(--on-ink)", ...style }}>
      {steps.map((s, i) => (
        <li key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ padding: "12px 18px", background: s.human ? "var(--accent)" : "var(--ink-raised)", border: "1px solid " + (s.human ? "var(--accent)" : "var(--ink-line-strong)"), borderRadius: 8, color: s.human ? "var(--ink)" : "var(--on-ink)", fontFamily: "var(--font-mono)", fontSize: "0.9375rem", fontWeight: s.human ? 500 : 400 }}>{s.label}</span>
          {i < steps.length - 1 && <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--on-ink-subtle)" }}><path d="M6 3l5 5-5 5" /></svg>}
        </li>
      ))}
    </ol>
  );
}
/** .principle — hairline-topped heading + muted text on dark */
export function Principle({ title, children, style }) {
  return (
    <div style={{ paddingTop: 20, borderTop: "1px solid var(--ink-line)", color: "var(--on-ink)", fontFamily: "var(--font-sans)", ...style }}>
      <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", lineHeight: 1.3 }}>{title}</h3>
      <p style={{ margin: 0, color: "var(--on-ink-muted)", textWrap: "pretty" }}>{children}</p>
    </div>
  );
}
