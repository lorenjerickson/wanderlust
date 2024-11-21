import TextField from "@mui/material/TextField";
import { StyledTextInput } from "./TextInput.styles";
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";

type TextInputProps = {
  type?: string;
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  leading?: React.ReactNode;
  trailing: React.ReactNode;
};

export function TextInput(props: TextInputProps) {
  const {
    id,
    name,
    placeholder,
    value,
    label,
    onChange,
    leading,
    trailing,
    type,
  } = props;
  return (
    <StyledTextInput>
      <TextField
        variant="filled"
        label={label}
        type={type || "text"}
        onChange={onChange}
        placeholder={placeholder}
        id={id}
        name={name}
        value={value}
        sx-{...{width: "100%"}}
        slotProps={{
          input: {
            startAdornment: leading && (
              <InputAdornment position="start">{leading}</InputAdornment>
            ),
            endAdornment: trailing && (
              <InputAdornment position="end">{trailing}</InputAdornment>
            ),
          },
        }}
      />
    </StyledTextInput>
  );
}
