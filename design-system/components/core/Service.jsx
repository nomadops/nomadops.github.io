import React from "react";
import { CardLabel } from "./Eyebrow.jsx";
/** .service — services-page article: intro column + detail column */
export function Service({ id, label, title, intro, children, style }) {
  return (
    <article id={id} style={{ display: "flex", flexWrap: "wrap", gap: "24px 48px", padding: "clamp(24px, 4vw, 40px)", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, fontFamily: "var(--font-sans)", color: "var(--text)", lineHeight: 1.6, ...style }}>
      <div style={{ flex: "1 1 320px", minWidth: 0 }}>
        <CardLabel>{label}</CardLabel>
        <h2 style={{ margin: "8px 0 12px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.625rem, 3vw, 1.875rem)", lineHeight: 1.2, letterSpacing: "-0.01em", textWrap: "balance" }}>{title}</h2>
        <p style={{ margin: 0, color: "var(--text-muted)", textWrap: "pretty" }}>{intro}</p>
      </div>
      <div style={{ display: "flex", flex: "2 1 420px", flexDirection: "column", gap: 24, minWidth: 0 }}>{children}</div>
    </article>
  );
}
/** .mini-agents — compact agent name/role tiles */
export function MiniAgents({ agents = [] }) {
  return <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))", gap: 12, margin: 0, padding: 0, listStyle: "none", fontFamily: "var(--font-sans)" }}>
    {agents.map((a) => <li key={a.name} style={{ padding: "14px 16px", background: "var(--paper-tint)", border: "1px solid var(--line)", borderRadius: 8 }}>
      <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700 }}>{a.name}</span>
      <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.9375rem" }}>{a.role}</span></li>)}</ul>;
}
/** .steps — numbered steps with a 2px ink top rule */
export function Steps({ steps = [] }) {
  return <ol style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "20px 32px", margin: "32px 0 0", padding: 0, listStyle: "none", fontFamily: "var(--font-sans)", color: "var(--text)", lineHeight: 1.6 }}>
    {steps.map((s, i) => <li key={i} style={{ paddingTop: 20, borderTop: "2px solid var(--ink)" }}>
      <p style={{ margin: 0, color: "var(--accent-text)", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>Step {i + 1}</p>
      <h3 style={{ margin: "4px 0 8px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.375rem", lineHeight: 1.25 }}>{s.title}</h3>
      <p style={{ margin: 0, color: "var(--text-muted)", textWrap: "pretty" }}>{s.text}</p></li>)}</ol>;
}
