import { StyledFormField } from "./FormField.styles";

type FormFieldProps = {
  className?: string;
  label: string;
  children: React.ReactNode;
};

export function FormField(props: FormFieldProps) {
  const { className, label, children } = props;
  return (
    <StyledFormField className={className}>
      <label>{label}</label>
      {children}
    </StyledFormField>
  );
}
