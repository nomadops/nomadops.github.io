export interface FieldProps {
  id: string;
  label: string;
  type?: string;
  multiline?: boolean;
  /** Error text; shown only after the field is blurred */
  error?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  required?: boolean;
  autoComplete?: string;
}
export function Field(props: FieldProps): JSX.Element;
