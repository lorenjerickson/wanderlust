import InputAdornment from "@mui/material/InputAdornment";
import MuiTextInput from "@mui/material/TextField";
import { ReactNode } from "react";
import { theme } from "../../theme/theme";

type TextInputProps = {
  type?: string;
  id?: string;
  name: string;
  label: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
  required?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function TextInput(props: TextInputProps) {
  const {
    id,
    name,
    placeholder = "",
    value,
    onChange,
    type = "text",
    className = "",
    required = false,
    label,
    leading,
    trailing,
  } = props;
  return (
    <MuiTextInput
      value={value}
      onChange={onChange}
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      className={className}
      required={required}
      label={label}
      sx={{
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      }}
      slotProps={{
        input: {
          startAdornment: leading ? (
            <InputAdornment position="start">{leading}</InputAdornment>
          ) : undefined,
          endAdornment: trailing ? (
            <InputAdornment position="end">{trailing}</InputAdornment>
          ) : undefined,
        },
      }}
      variant="filled"
    />
  );
}
