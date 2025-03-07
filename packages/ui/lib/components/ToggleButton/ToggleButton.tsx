import { PropsWithChildren } from "react";
import MuiToggleButton from "@mui/material/ToggleButton";

export type ToggleButtonProps = {
  onChange: () => void;
  value: string;
  name?: string;
};

export function ToggleButton({
  children,
  onChange,
  name,
  value,
}: PropsWithChildren<ToggleButtonProps>) {
  return (
    <MuiToggleButton name={name} value={value} onChange={onChange}>
      {children}
    </MuiToggleButton>
  );
}
