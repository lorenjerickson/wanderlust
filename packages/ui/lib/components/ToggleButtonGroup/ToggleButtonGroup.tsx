import { MouseEvent, PropsWithChildren } from "react";
import { ToggleButton, ToggleButtonProps } from "../ToggleButton/ToggleButton";
import MuiToggleButtonGroup from "@mui/material/ToggleButtonGroup";

type ToggleButtonGroupProps = {
  buttons: Array<ToggleButtonProps>;
  value: string;
  onChange: (event: MouseEvent) => void;
};

export function ToggleButtonGroup({
  buttons,
  value,
  onChange,
}: ToggleButtonGroupProps) {
  return (
    <MuiToggleButtonGroup value={value} exclusive onChange={onChange}>
      {buttons.map((button: PropsWithChildren<ToggleButtonProps>) => (
        <ToggleButton
          key={button.value}
          value={button.value}
          onChange={button.onChange}
        >
          {button.children}
        </ToggleButton>
      ))}
    </MuiToggleButtonGroup>
  );
}
