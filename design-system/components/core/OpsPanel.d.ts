/**
 * @startingPoint section="Core" subtitle="Light operations panel mock" viewport="520x460"
 */
export interface OpsPanelProps {
  app?: string;
  section?: string;
  meta?: string;
  groups?: { label: string; rows: { label: React.ReactNode; meta?: string; status?: string; tone?: "ok" | "warn" | "fail" | "accent"; action?: string; accent?: boolean }[] }[];
  style?: React.CSSProperties;
}
export function OpsPanel(props: OpsPanelProps): JSX.Element;
