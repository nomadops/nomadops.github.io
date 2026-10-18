import React from "react";
import { Button } from "./Button.jsx";
const LINKS = [["Services", "services.html"], ["Agents", "#agents"], ["Approach", "#principles"], ["About", "about.html"], ["GitHub", "https://github.com/nomadops"]];
/** .site-header — dark in-flow header with brand, links, small primary CTA. */
export function Header({ links = LINKS, current, ctaLabel = "Let's talk", ctaHref = "#contact", assetsBase = "../../assets", onNavigate }) {
  const [h, setH] = React.useState(null);
  const nav = (href) => onNavigate ? (e) => { e.preventDefault(); onNavigate(href); } : undefined;
  return (
    <header style={{ background: "var(--ink)", color: "var(--on-ink)", fontFamily: "var(--font-sans)", fontSize: "1.0625rem", lineHeight: 1.6 }}>
      <nav aria-label="Main" style={{ maxWidth: 1200, marginInline: "auto", paddingInline: "clamp(16px, 4vw, 24px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px 16px", paddingBlock: 18 }}>
        <a href="index.html" onClick={nav("index.html")} style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--on-ink)", fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.02em", textDecoration: "none" }}>
          <img src={assetsBase + "/images/corgi-logo-96.webp"} alt="" width="44" height="44" style={{ width: 44, height: 44, borderRadius: "50%", display: "block" }} />nomadops
        </a>
        <ul style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4, margin: 0, padding: 0, listStyle: "none" }}>
          {links.map(([label, href]) => {
            const cur = current === label;
            return <li key={label}><a href={href} onClick={nav(href)} aria-current={cur ? "page" : undefined} onMouseEnter={() => setH(label)} onMouseLeave={() => setH(null)}
              style={{ display: "inline-flex", alignItems: "center", minHeight: 44, paddingInline: 14, color: cur || h === label ? "var(--on-ink)" : "var(--on-ink-muted)", textDecoration: "none", boxShadow: cur ? "inset 0 -2px 0 var(--accent)" : "none" }}>{label}</a></li>;
          })}
          <li><Button size="sm" href={ctaHref} onClick={nav(ctaHref)} style={{ marginInlineStart: 8 }}>{ctaLabel}</Button></li>
        </ul>
      </nav>
    </header>
  );
}
