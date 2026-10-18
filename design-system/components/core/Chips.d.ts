export interface PillProps { children: React.ReactNode; style?: React.CSSProperties }
export function Pill(props: PillProps): JSX.Element;
export interface BadgeProps { children: React.ReactNode; /** solid orange "needs approval" */ approval?: boolean; style?: React.CSSProperties }
export function Badge(props: BadgeProps): JSX.Element;
export interface TagsProps { items: string[]; style?: React.CSSProperties }
export function Tags(props: TagsProps): JSX.Element;
export interface DotProps { tone?: "fail" | "accent" | "ok" | "warn"; style?: React.CSSProperties }
export function Dot(props: DotProps): JSX.Element;
