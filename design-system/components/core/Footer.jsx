import React from "react";
const LINKS = [["GitHub", "https://github.com/nomadops"], ["Terraform Registry", "https://registry.terraform.io/namespaces/nomadops"], ["Upwork", "https://www.upwork.com/ag/nomadops/"], ["Fiverr", "https://www.fiverr.com/nomadops"], ["Twitter", "https://twitter.com/nomadopsio"], ["Slack", "https://nomadopsllc.slack.com"]];
/** .site-footer — dark footer with small brand + text links */
export function Footer({ links = LINKS, assetsBase = "../../assets" }) {
  const [h, setH] = React.useState(null);
  return (
    <footer style={{ background: "var(--ink)", color: "var(--on-ink)", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
      <div style={{ maxWidth: 1200, marginInline: "auto", paddingInline: "clamp(16px, 4vw, 24px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px 24px", paddingBlock: 40 }}>
        <a href="index.html" style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--on-ink)", fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.02em", textDecoration: "none" }}>
          <img src={assetsBase + "/images/corgi-logo-96.webp"} alt="" width="36" height="36" style={{ width: 36, height: 36, borderRadius: "50%", display: "block" }} />nomadops
        </a>
        <ul style={{ display: "flex", flexWrap: "wrap", gap: "0 24px", margin: 0, padding: 0, listStyle: "none", fontSize: "0.9375rem" }}>
          {links.map(([label, href]) => <li key={label}><a href={href} onMouseEnter={() => setH(label)} onMouseLeave={() => setH(null)} style={{ display: "inline-flex", alignItems: "center", minHeight: 44, color: h === label ? "var(--on-ink)" : "var(--on-ink-muted)", textUnderlineOffset: "0.2em" }}>{label}</a></li>)}
        </ul>
      </div>
    </footer>
  );
}
