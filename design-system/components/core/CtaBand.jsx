import React from "react";
import { Button } from "./Button.jsx";
/** .cta-band.dark — rounded dark band with a heading and a primary button */
export function CtaBand({ title, ctaLabel = "Contact us", ctaHref = "index.html#contact", onCta, style }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "clamp(32px, 5vw, 48px) clamp(24px, 4vw, 40px)", borderRadius: 12, background: "var(--ink)", color: "var(--on-ink)", fontFamily: "var(--font-sans)", ...style }}>
      <h2 style={{ maxWidth: 640, margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.625rem, 3vw, 2.125rem)", lineHeight: 1.15, textWrap: "balance" }}>{title}</h2>
      <Button href={ctaHref} onClick={onCta}>{ctaLabel}</Button>
    </div>
  );
}
