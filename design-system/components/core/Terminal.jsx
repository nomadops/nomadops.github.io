import React from "react";
import { Pill, Dot } from "./Chips.jsx";
import { Button } from "./Button.jsx";
const SYM = { fail: { ch: "✗", c: "var(--fail-on-ink)" }, step: { ch: "→", c: "var(--accent)" }, ok: { ch: "✓", c: "var(--ok-on-ink)" } };
/** .terminal — hero agent-activity card with the approve/replay demo. lines: {sym, text} or {agent, note}. */
export function Terminal({ title = "Incident on /checkout", pill = "sre · production", lines = [], waitingText, approvedText, whyHref = "#principles", style }) {
  const [approved, setApproved] = React.useState(false);
  const mono = { fontFamily: "var(--font-mono)", fontSize: "0.875rem" };
  const foot = { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 20px", borderTop: "1px solid var(--ink-line)" };
  const status = { display: "flex", alignItems: "center", gap: 10, margin: 0, fontSize: "0.9375rem" };
  return (
    <div style={{ overflow: "hidden", background: "var(--ink-raised)", border: "1px solid var(--ink-line)", borderRadius: 12, color: "var(--on-ink)", fontFamily: "var(--font-sans)", lineHeight: 1.6, ...style }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", borderBottom: "1px solid var(--ink-line)" }}>
        <p style={{ ...status, fontWeight: 600 }}><Dot tone="fail" />{title}</p>
        <Pill>{pill}</Pill>
      </div>
      <ol style={{ margin: 0, padding: "18px 20px", color: "var(--on-ink-muted)", ...mono, lineHeight: 1.85, listStyle: "none" }}>
        {lines.map((l, i) => l.agent
          ? <li key={i} style={{ marginTop: i ? 10 : 0, color: "var(--on-ink)", fontFamily: "var(--font-sans)", fontSize: "0.9375rem", fontWeight: 600 }}>{l.agent} <span style={{ color: "var(--on-ink-subtle)", fontWeight: 400 }}>· {l.note}</span></li>
          : <li key={i} style={{ paddingInlineStart: "2ch", textIndent: "-2ch" }}><span aria-hidden="true" style={{ color: SYM[l.sym || "step"].c }}>{SYM[l.sym || "step"].ch}</span> {l.text}</li>)}
      </ol>
      <div aria-live="polite">
        {!approved ? (
          <div style={foot}>
            <p style={status}><Dot tone="accent" />{waitingText}</p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
              <a href={whyHref} style={{ color: "var(--on-ink-muted)", fontSize: "0.9375rem", textUnderlineOffset: "0.2em" }}>Why agents ask first</a>
              <Button size="sm" type="button" onClick={() => setApproved(true)}>Approve</Button>
            </div>
          </div>
        ) : (
          <div style={foot}>
            <p style={status}><span aria-hidden="true" style={{ color: "var(--ok-on-ink)", ...mono }}>✓</span>{approvedText}</p>
            <Button variant="ghost" size="sm" type="button" onClick={() => setApproved(false)}>Replay</Button>
          </div>
        )}
      </div>
    </div>
  );
}
