/**
 * @startingPoint section="Core" subtitle="Numbered what-we-do card" viewport="320x240"
 */
export interface CardProps {
  /** e.g. "01 · Agents" */
  label?: string;
  title: React.ReactNode;
  children: React.ReactNode;
  moreLabel?: string;
  moreHref?: string;
  onMore?: React.MouseEventHandler;
  style?: React.CSSProperties;
}
export function Card(props: CardProps): JSX.Element;
