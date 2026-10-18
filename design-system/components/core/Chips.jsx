import React from "react";
/** .pill — mono outline chip on dark */
export function Pill({ children, style }) {
  return <span style={{ padding: "3px 10px", border: "1px solid var(--ink-line)", borderRadius: 999, color: "var(--on-ink-subtle)", fontFamily: "var(--font-mono)", fontSize: "0.8125rem", lineHeight: 1.6, ...style }}>{children}</span>;
}
/** .badge / .badge-approval — tiny mono status chip in the MCP tool list */
export function Badge({ children, approval = false, style }) {
  return <span style={{ padding: "3px 10px", border: "1px solid " + (approval ? "var(--accent)" : "var(--ink-line-strong)"), borderRadius: 999, background: approval ? "var(--accent)" : "transparent", color: approval ? "var(--ink)" : "var(--on-ink-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: approval ? 500 : 400, lineHeight: 1.6, ...style }}>{children}</span>;
}
/** .tags — light chips (Terraform, Pulumi, MCP) */
export function Tags({ items, style }) {
  return <ul style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: 0, padding: 0, listStyle: "none", fontFamily: "var(--font-mono)", fontSize: "0.875rem", ...style }}>
    {items.map((t) => <li key={t} style={{ padding: "6px 12px", background: "var(--chip)", border: "1px solid var(--line)", borderRadius: 999 }}>{t}</li>)}</ul>;
}
const DOTS = { fail: "var(--fail-on-ink)", accent: "var(--accent)", ok: "var(--ok)", warn: "var(--warn)" };
/** .dot — 8px status dot */
export function Dot({ tone = "accent", style }) {
  return <span aria-hidden="true" style={{ flex: "none", display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: DOTS[tone] || DOTS.accent, ...style }}></span>;
}
