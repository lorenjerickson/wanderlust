import { MouseEvent } from "react";
import MuiButton from "@mui/material/Button";

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
