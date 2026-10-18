import React from "react";
/** .tool-strip — white strip under the hero: "We work with" + mono list */
export function ToolStrip({ label = "We work with", items = [], style }) {
  return (
    <section aria-label="What we work with" style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", ...style }}>
      <div style={{ maxWidth: 1200, marginInline: "auto", paddingInline: "clamp(16px, 4vw, 24px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 32px", paddingBlock: 28, color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
        <p style={{ margin: 0, color: "var(--text)", fontWeight: 500 }}>{label}</p>
        <ul style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px", margin: 0, padding: 0, listStyle: "none" }}>{items.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
    </section>
  );
}
