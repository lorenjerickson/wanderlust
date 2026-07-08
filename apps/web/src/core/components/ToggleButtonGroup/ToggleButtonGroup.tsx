import { MouseEvent, PropsWithChildren } from "react";
import { ToggleButton, ToggleButtonProps } from "../ToggleButton/ToggleButton";

type ToggleButtonGroupProps = {
  buttons: Array<ToggleButtonProps>;
  value: string;
  onChange: (event: MouseEvent, value: string) => void;
};

export function ToggleButtonGroup({
  buttons,
  value,
  onChange,
}: ToggleButtonGroupProps) {
  return (
    <div className="join">
      {buttons.map((button: PropsWithChildren<ToggleButtonProps>) => {
        const selected = button.value === value;

        return (
          <ToggleButton
            key={button.value}
            value={button.value}
            label={button.label}
            selected={selected}
            onChange={(event) => {
              button.onChange?.(event);
              onChange(event, button.value);
            }}
            icon={selected ? button.selectedIcon : button.icon}
          >
            {button.children}
          </ToggleButton>
        );
      })}
    </div>
  );
}
