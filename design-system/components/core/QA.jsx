import React from "react";
import { Eyebrow } from "./Eyebrow.jsx";
/** .qa > section — eyebrow question, h2 answer headline, paragraph */
export function QA({ question, title, children, style }) {
  return (
    <section style={{ fontFamily: "var(--font-sans)", color: "var(--text)", lineHeight: 1.6, ...style }}>
      <Eyebrow style={{ marginBottom: 8 }}>{question}</Eyebrow>
      <h2 style={{ margin: "0 0 12px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.75rem", lineHeight: 1.2, textWrap: "balance" }}>{title}</h2>
      <p style={{ margin: 0, color: "var(--text-muted)", textWrap: "pretty" }}>{children}</p>
    </section>
  );
}
/** .friend — initials disc + name link + description */
export function Friend({ initials, name, href, children, style }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: 24, border: "1px solid var(--line)", borderRadius: 10, fontFamily: "var(--font-sans)", color: "var(--text)", lineHeight: 1.6, listStyle: "none", ...style }}>
      <span aria-hidden="true" style={{ display: "flex", flex: "none", alignItems: "center", justifyContent: "center", width: 48, height: 48, background: "var(--chip)", border: "1px solid var(--line)", borderRadius: "50%", fontFamily: "var(--font-display)", fontWeight: 700 }}>{initials}</span>
      <div>
        <h3 style={{ margin: "0 0 4px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem" }}><a href={href} style={{ color: "var(--text)", textUnderlineOffset: "0.2em" }}>{name}</a></h3>
        <p style={{ margin: 0, color: "var(--text-muted)" }}>{children}</p>
      </div>
    </li>
  );
}
