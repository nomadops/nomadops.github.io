/**
 * @startingPoint section="Core" subtitle="Agent activity card with approve demo" viewport="560x560"
 */
export interface TerminalProps {
  title?: string;
  pill?: string;
  /** log lines: { sym: "fail"|"step"|"ok", text } or agent headers { agent, note } */
  lines?: Array<{ sym?: "fail" | "step" | "ok"; text?: string; agent?: string; note?: string }>;
  waitingText: string;
  approvedText: string;
  whyHref?: string;
  style?: React.CSSProperties;
}
export function Terminal(props: TerminalProps): JSX.Element;
