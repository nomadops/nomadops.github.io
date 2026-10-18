export interface ArrowsProps {
  items: React.ReactNode[];
  onDark?: boolean;
  /** row gap in px (site: 10 default, 8 in agent cards, 12 in services) */
  gap?: number;
  style?: React.CSSProperties;
}
export function Arrows(props: ArrowsProps): JSX.Element;
