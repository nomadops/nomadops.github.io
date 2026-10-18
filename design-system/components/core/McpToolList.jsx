import React from "react";
import { Badge } from "./Chips.jsx";
/** .feature-media.mock-dark — MCP server tool list */
export function McpToolList({ server = "your-app · MCP server", meta, tools = [], foot, style }) {
  const mono = { fontFamily: "var(--font-mono)", fontSize: "0.875rem" };
  return (
    <figure style={{ margin: 0, overflow: "hidden", borderRadius: 12, background: "var(--ink)", color: "var(--on-ink)", fontFamily: "var(--font-sans)", lineHeight: 1.6, ...style }}>
      <figcaption style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 20px", borderBottom: "1px solid var(--ink-line)", ...mono }}>
        <span>{server}</span><span style={{ color: "var(--on-ink-subtle)", fontSize: "0.8125rem" }}>{meta ?? tools.length + " tools"}</span>
      </figcaption>
      <ul style={{ margin: 0, padding: "4px 0", listStyle: "none" }}>
        {tools.map((t, i) => (
          <li key={t.name} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px 12px", padding: "11px 20px", borderBottom: i < tools.length - 1 ? "1px solid var(--ink-row)" : 0, ...mono }}>
            {t.name} <Badge approval={!!t.approval}>{t.approval ? "needs approval" : "read"}</Badge>
          </li>
        ))}
      </ul>
      {foot && <p style={{ margin: 0, padding: "12px 20px", borderTop: "1px solid var(--ink-line)", color: "var(--on-ink-subtle)", fontFamily: "var(--font-mono)", fontSize: "0.8125rem" }}>{foot}</p>}
    </figure>
  );
}
