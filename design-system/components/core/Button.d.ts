/**
 * @startingPoint section="Core" subtitle="Primary / ghost / dark button" viewport="420x120"
 */
export interface ButtonProps {
  /** primary (orange), ghost (outline on dark), dark (ink fill on light) */
  variant?: "primary" | "ghost" | "dark";
  size?: "md" | "sm";
  href?: string;
  type?: "button" | "submit";
  onClick?: React.MouseEventHandler;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export function Button(props: ButtonProps): JSX.Element;
