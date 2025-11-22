import { MouseEvent } from "react";
import MuiButton from "@mui/material/Button";
import { theme } from "../../theme/theme";

type ButtonProps = {
  onClick: (e: MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
};

export function Button(props: ButtonProps) {
  const { onClick, children, className, type, variant, disabled } = props;
  return (
    <MuiButton
      sx={{
        color: variant === "primary" ? "#eee" : theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        backgroundColor:
          variant === "primary" ? theme.palette.primary.main : "transparent",
      }}
      className={className}
      type={type}
      disabled={disabled}
      variant={variant === "secondary" ? "outlined" : "contained"}
      onClick={onClick}
    >
      {children}
    </MuiButton>
  );
}
