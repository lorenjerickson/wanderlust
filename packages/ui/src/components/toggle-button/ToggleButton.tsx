import { Button } from "antd";
import { PropsWithChildren } from "react";

import classes from "./ToggleButton.module.scss";

type ToggleButtonProps = {
  onToggleChanged: (isToggled: boolean) => void;
  isToggled: boolean;
};

export function ToggleButton({
  onToggleChanged,
  isToggled,
  children,
}: PropsWithChildren<ToggleButtonProps>) {
  return (
    <div>
      <Button
        onClick={() => onToggleChanged(!isToggled)}
        className={`${classes.button} ${isToggled ? "toggledOn" : "toggledOfF"}`}
      >
        {children}
      </Button>
    </div>
  );
}
