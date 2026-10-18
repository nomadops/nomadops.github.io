import React from "react";
/** .more — semibold link with a trailing → */
export function More({ href = "#", children, onDark = false, onClick, style }) {
  const [h, setH] = React.useState(false);
  return <a href={href} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ fontFamily: "var(--font-sans)", fontWeight: 600, color: h ? (onDark ? "var(--on-ink)" : "var(--accent-text)") : (onDark ? "var(--on-ink-muted)" : "var(--text)"), textUnderlineOffset: "0.2em", ...style }}>{children} <span aria-hidden="true">→</span></a>;
}
