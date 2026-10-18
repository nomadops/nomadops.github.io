// Converts a page's front-matter `sections` into plain Markdown for llms-full.txt.
// One function, one case per section type. Keep it in step with _includes/sections/*.njk.
const list = (items = []) => items.map((i) => "- " + i).join("\n");

const render = {
  hero: (s) => `# ${s.title}\n\n${s.lead}` + (s.terminal ? `\n\nExample incident (${s.terminal.pill}): ${s.terminal.title}\n` +
    s.terminal.lines.map((l) => l.agent ? `\n**${l.agent}** · ${l.note}` : `- ${l.sym === "fail" ? "✗" : l.sym === "ok" ? "✓" : "→"} ${l.text}`).join("\n") +
    `\n\n${s.terminal.waiting}` : ""),
  pageHero: (s) => `# ${s.title}\n\n${s.lead}`,
  toolStrip: (s) => `${s.label}: ${s.items.join(", ")}.`,
  cards: (s) => `## ${s.title}\n\n${s.lead ?? ""}\n\n` + s.items.map((c) => `### ${c.title}\n\n${c.text}`).join("\n\n"),
  agents: (s) => `## ${s.title}\n\n${s.lead}\n\n` + s.items.map((a) => `### ${a.name} — ${a.role}\n\n${a.summary}\n\n${list(a.items)}`).join("\n\n"),
  feature: (s) => `## ${s.title}\n\n${s.lead}\n\n${list(s.items)}` + (s.mcpTools ? `\n\nExample MCP tools: ` + s.mcpTools.map((t) => `${t.name} (${t.approval ? "needs approval" : "read"})`).join(", ") + "." : ""),
  principles: (s) => `## ${s.title}\n\n${s.lead}\n\nFlow: ${s.flow.map((x) => x.label).join(" → ")}\n\n` + s.items.map((p) => `### ${p.title}\n\n${p.text}`).join("\n\n"),
  split: (s) => `## ${s.title}\n\n${s.lead}`,
  contact: (s) => `## ${s.title}\n\n${s.lead}\n\n` + s.links.map((l) => `- ${l.label}: ${l.href}`).join("\n"),
  services: (s) => s.items.map((x) => `## ${x.title}\n\n${x.intro}\n\n${list(x.items)}` + (x.agents ? "\n\nAgents: " + x.agents.map((a) => `${a.name} (${a.role})`).join(", ") + "." : "") + (x.tags ? "\n\nTags: " + x.tags.join(", ") + "." : "")).join("\n\n"),
  steps: (s) => `## ${s.title}\n\n` + s.items.map((x, i) => `${i + 1}. **${x.title}** — ${x.text}`).join("\n"),
  cta: (s) => `> ${s.title}`,
  qa: (s) => s.items.map((q) => `## ${q.question}\n\n**${q.title}** ${q.text}`).join("\n\n"),
  friends: (s) => `## ${s.title}\n\n${s.lead}\n\n` + s.items.map((x) => `- **${x.name}** (${x.href}) — ${x.text}`).join("\n"),
};

export function sectionsToMarkdown(sections = []) {
  return sections.map((s) => (render[s.type] ? render[s.type](s) : "")).filter(Boolean).join("\n\n");
}
