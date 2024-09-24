import { Radio } from "@mantine/core"

<<<<<<< HEAD
import { ReactNode } from "react";
import classes from "./ToggleButtonGroup.module.scss";

type ToggleButtonGroupProps = {
  buttons: Array<{
    icon: ReactNode;
    value: string;
  }>;
  onChange: (value: string) => void;
};
=======
import { ReactNode } from "react"
import classes from "./ToggleButtonGroup.module.scss"

type ToggleButtonGroupProps = {
  buttons: Array<{
    icon: ReactNode
    value: string
  }>
  onChange: (value: string) => void
}
>>>>>>> cb21b1c (feat: auth with jwt)

export function ToggleButtonGroup({
  buttons,
  onChange,
}: ToggleButtonGroupProps) {
  return (
    <Radio.Group
      className={classes.toggleButtonGroup}
<<<<<<< HEAD
      onChange={(e) => onChange(e.target.value)}
    >
      {buttons.map((button) => (
        <Radio.Button
=======
      onChange={(e) => onChange(e)}
    >
      {buttons.map((button) => (
        <Radio
>>>>>>> cb21b1c (feat: auth with jwt)
          className={`${classes.toggleButton}`}
          value={button.value}
          key={button.value}
        >
          {button.icon}
<<<<<<< HEAD
        </Radio.Button>
      ))}
    </Radio.Group>
  );
=======
        </Radio>
      ))}
    </Radio.Group>
  )
>>>>>>> cb21b1c (feat: auth with jwt)
}
