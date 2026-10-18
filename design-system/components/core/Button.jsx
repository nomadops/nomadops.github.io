import React from "react";
const V = {
  primary: { bg: "var(--accent)", bd: "var(--accent)", fg: "var(--ink)", hbg: "var(--accent-hover)", hbd: "var(--accent-hover)", hfg: "var(--ink)" },
  ghost: { bg: "transparent", bd: "var(--ink-line-strong)", fg: "var(--on-ink)", hbg: "transparent", hbd: "var(--on-ink-subtle)", hfg: "var(--on-ink)" },
  dark: { bg: "var(--ink)", bd: "var(--ink)", fg: "var(--on-ink)", hbg: "var(--btn-dark-hover)", hbd: "var(--ink)", hfg: "var(--on-ink)" },
};
/** .btn / .btn-primary / .btn-ghost / .btn-dark / .btn-sm from site.css */
export function Button({ variant = "primary", size = "md", href, children, style, ...rest }) {
  const [h, setH] = React.useState(false);
  const v = V[variant] || V.primary;
  const s = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: size === "sm" ? 44 : 48,
    padding: size === "sm" ? "0 16px" : "0 24px", border: "1px solid " + (h ? v.hbd : v.bd), borderRadius: 6,
    background: h ? v.hbg : v.bg, color: h ? v.hfg : v.fg, font: "inherit", fontFamily: "var(--font-sans)", fontWeight: 600,
    fontSize: size === "sm" ? "0.9375rem" : "1.0625rem", lineHeight: 1.2, textDecoration: "none", cursor: "pointer", ...style };
  const T = href ? "a" : "button";
  return <T href={href} style={s} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} {...rest}>{children}</T>;
}
