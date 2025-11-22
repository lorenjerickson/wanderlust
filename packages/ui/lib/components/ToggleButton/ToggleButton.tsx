import { PropsWithChildren, ReactNode } from "react";
import MuiToggleButton from "@mui/material/ToggleButton";
import { theme } from "../../theme/theme";

export type ToggleButtonProps = {
  value: string;
  label?: string;
  icon?: ReactNode;
  selectedIcon?: ReactNode;
  onChange?: () => void;
};

export function ToggleButton({
  onChange,
  label,
  icon,
  value,
}: PropsWithChildren<ToggleButtonProps>) {
  return (
    <MuiToggleButton
      name={label}
      value={value}
      onChange={onChange}
      aria-label={label}
      size="small"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 0,
        color: "#111",
        backgroundColor: "transparent",
      }}
    >
      {icon && <div style={{ color: theme.palette.primary.main }}>{icon}</div>}
      {label && label}
    </MuiToggleButton>
  );
}
