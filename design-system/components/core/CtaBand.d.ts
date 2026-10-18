/**
 * @startingPoint section="Core" subtitle="Dark CTA band" viewport="900x160"
 */
export interface CtaBandProps {
  title: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  onCta?: React.MouseEventHandler;
  style?: React.CSSProperties;
}
export function CtaBand(props: CtaBandProps): JSX.Element;
