import React from "react";
import { CardLabel } from "./Eyebrow.jsx";
import { More } from "./More.jsx";
/** .card — white bordered card with numbered label, h3, muted body, optional more link pinned to the bottom. */
export function Card({ label, title, children, moreLabel, moreHref, onMore, style }) {
  return (
    <article style={{ display: "flex", flexDirection: "column", gap: 12, padding: 28, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 10, fontFamily: "var(--font-sans)", color: "var(--text)", ...style }}>
      {label && <CardLabel>{label}</CardLabel>}
      <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.375rem", lineHeight: 1.25, textWrap: "balance" }}>{title}</h3>
      <p style={{ margin: 0, color: "var(--text-muted)", textWrap: "pretty" }}>{children}</p>
      {moreLabel && <More href={moreHref} onClick={onMore} style={{ marginTop: "auto" }}>{moreLabel}</More>}
    </article>
  );
}
