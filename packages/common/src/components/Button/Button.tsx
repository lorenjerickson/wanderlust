import { MouseEvent } from "react";

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
  const variantClass = variant === "secondary" ? "btn-outline" : "btn-primary";

  return (
    <button
      className={["btn", variantClass, className].filter(Boolean).join(" ")}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
