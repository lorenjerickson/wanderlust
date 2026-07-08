import { MouseEvent, PropsWithChildren, ReactNode } from "react";

export type ToggleButtonProps = {
  value: string;
  label?: string;
  icon?: ReactNode;
  selectedIcon?: ReactNode;
  selected?: boolean;
  onChange?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function ToggleButton({
  onChange,
  label,
  icon,
  value,
  selected,
  children,
}: PropsWithChildren<ToggleButtonProps>) {
  return (
    <button
      name={label}
      value={value}
      onClick={onChange}
      aria-label={label}
      aria-pressed={selected}
      type="button"
      className={["btn btn-sm join-item", selected ? "btn-primary" : "btn-ghost"].join(" ")}
    >
      {icon}
      {children ?? label}
    </button>
  );
}
