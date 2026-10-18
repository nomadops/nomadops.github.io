export interface FlowProps { steps?: { label: string; human?: boolean }[]; style?: React.CSSProperties }
export function Flow(props: FlowProps): JSX.Element;
export interface PrincipleProps { title: string; children: React.ReactNode; style?: React.CSSProperties }
export function Principle(props: PrincipleProps): JSX.Element;
