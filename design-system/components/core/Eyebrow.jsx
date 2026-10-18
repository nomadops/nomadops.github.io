import React from "react";
/** .eyebrow — mono uppercase label. onDark switches to the orange accent. */
export function Eyebrow({ children, onDark = false, style }) {
  return <p style={{ margin: "0 0 12px", color: onDark ? "var(--accent)" : "var(--accent-text)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.6, ...style }}>{children}</p>;
}
/** .card-label — mono uppercase numbered label (no letter-spacing). */
export function CardLabel({ children, style }) {
  return <p style={{ margin: 0, color: "var(--accent-text)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", textTransform: "uppercase", lineHeight: 1.6, ...style }}>{children}</p>;
}
