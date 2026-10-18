/**
 * @startingPoint section="Core" subtitle="Dark site header" viewport="1100x90"
 */
export interface HeaderProps {
  /** [label, href] pairs */
  links?: [string, string][];
  /** label of the current page (gets the orange underline) */
  current?: string;
  ctaLabel?: string;
  ctaHref?: string;
  assetsBase?: string;
  onNavigate?: (href: string) => void;
}
export function Header(props: HeaderProps): JSX.Element;
