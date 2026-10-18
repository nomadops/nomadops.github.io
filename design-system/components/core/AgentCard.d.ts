/**
 * @startingPoint section="Core" subtitle="Dark agent profile card" viewport="360x420"
 */
export interface AgentCardProps {
  icon?: "fixer" | "debugger" | "pipelines";
  /** mono pill top-right, e.g. "fixer" */
  pill?: string;
  name: string;
  role: string;
  summary: React.ReactNode;
  items?: React.ReactNode[];
  style?: React.CSSProperties;
}
export function AgentCard(props: AgentCardProps): JSX.Element;
