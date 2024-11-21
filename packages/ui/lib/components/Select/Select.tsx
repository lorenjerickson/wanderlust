import { StyledSelect } from "./Select.styles";
import "../../theme/theme.scss";
import { FormControl, InputLabel } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

type OptionValue = {
  value: string;
  label: string;
};

type SelectProps = {
  options: OptionValue[];
  placeholder: string;
  className?: string;
  value?: string;
  label: string;
  onChange: (event: SelectChangeEvent) => void;
};

export function MySelect(props: SelectProps) {
  const { options, placeholder, className, onChange, value, label } = props;

  return (
    <StyledSelect>
      <FormControl variant="filled" className="form-control">
        <InputLabel id="demo-simple-select-filled-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={value}
          onChange={onChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </StyledSelect>
  );
}
