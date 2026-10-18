/**
 * @startingPoint section="Core" subtitle="Dark MCP server tool list mock" viewport="480x420"
 */
export interface McpToolListProps {
  server?: string;
  /** head meta, defaults to "N tools" */
  meta?: string;
  tools?: { name: string; approval?: boolean }[];
  foot?: string;
  style?: React.CSSProperties;
}
export function McpToolList(props: McpToolListProps): JSX.Element;
