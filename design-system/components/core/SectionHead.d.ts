export interface SectionHeadProps {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  onDark?: boolean;
  /** .section-title-sm size */
  small?: boolean;
  /** "All services" style link on the right */
  moreLabel?: string;
  moreHref?: string;
  /** .lead-narrow (max 640px) */
  narrow?: boolean;
  style?: React.CSSProperties;
}
export function SectionHead(props: SectionHeadProps): JSX.Element;
