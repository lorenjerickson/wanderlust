import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect, { SelectChangeEvent } from "@mui/material/Select";

type OptionValue = {
  value: string;
  label: string;
};

type SelectProps = {
  name: string;
  id: string;
  options: OptionValue[];
  className?: string;
  value?: string;
  label: string;
  onChange: (event: { name: string; value: string }) => void;
};

export function Select(props: SelectProps) {
  const { name, id, options, onChange, value, label } = props;

  const handleChange = (event: SelectChangeEvent) => {
    onChange({ name: event.target.name, value: event.target.value });
  };

  return (
    <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect value={value} onChange={handleChange} name={name} id={id}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options &&
          options.map((option) => (
            <MenuItem value={option.value}>{option.label}</MenuItem>
          ))}
      </MuiSelect>
    </FormControl>
  );
}
