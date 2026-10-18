import React from "react";
/** .arrows — list with mono → markers */
export function Arrows({ items, onDark = false, gap = 10, style }) {
  return (
    <ul style={{ display: "flex", flexDirection: "column", gap, margin: 0, padding: 0, listStyle: "none", fontFamily: "var(--font-sans)", color: onDark ? "var(--on-ink)" : "var(--text)", ...style }}>
      {items.map((t, i) => (
        <li key={i} style={{ display: "flex", gap: 10, textWrap: "pretty" }}>
          <span aria-hidden="true" style={{ flex: "none", color: onDark ? "var(--accent)" : "var(--accent-text)", fontFamily: "var(--font-mono)" }}>→</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
