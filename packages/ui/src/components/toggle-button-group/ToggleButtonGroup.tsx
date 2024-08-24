import { Radio } from "antd";

import { ReactNode } from "react";
import classes from "./ToggleButtonGroup.module.scss";

type ToggleButtonGroupProps = {
  buttons: Array<{
    icon: ReactNode;
    value: string;
  }>;
  onChange: (value: string) => void;
};

export function ToggleButtonGroup({
  buttons,
  onChange,
}: ToggleButtonGroupProps) {
  return (
    <Radio.Group
      className={classes.toggleButtonGroup}
      onChange={(e) => onChange(e.target.value)}
    >
      {buttons.map((button) => (
        <Radio.Button
          className={`${classes.toggleButton}`}
          value={button.value}
          key={button.value}
        >
          {button.icon}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}
