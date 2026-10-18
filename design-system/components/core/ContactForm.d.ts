/**
 * @startingPoint section="Core" subtitle="Contact form card" viewport="520x520"
 */
export interface ContactFormProps {
  onSubmit?: (values: { name: string; email: string; message: string }) => void;
  style?: React.CSSProperties;
}
export function ContactForm(props: ContactFormProps): JSX.Element;
