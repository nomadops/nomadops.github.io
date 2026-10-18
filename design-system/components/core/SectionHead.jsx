import React from "react";
import { Eyebrow } from "./Eyebrow.jsx";
import { More } from "./More.jsx";
/** .section-head: eyebrow + section-title + lead, optional "more" link aligned to the right. */
export function SectionHead({ eyebrow, title, lead, onDark = false, small = false, moreLabel, moreHref, narrow = false, style }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 48, fontFamily: "var(--font-sans)", ...style }}>
      <div style={{ maxWidth: 720 }}>
        {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
        <h2 style={{ margin: small ? "0 0 20px" : "0 0 16px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: small ? "clamp(1.875rem, 3.6vw, 2.5rem)" : "clamp(2rem, 4vw, 2.75rem)", lineHeight: small ? 1.12 : 1.1, letterSpacing: "-0.02em", textWrap: "balance", color: onDark ? "var(--on-ink)" : "var(--text)" }}>{title}</h2>
        {lead && <p style={{ margin: 0, maxWidth: narrow ? 640 : undefined, color: onDark ? "var(--on-ink-muted)" : "var(--text-muted)", textWrap: "pretty" }}>{lead}</p>}
      </div>
      {moreLabel && <More href={moreHref} onDark={onDark}>{moreLabel}</More>}
    </div>
  );
}
