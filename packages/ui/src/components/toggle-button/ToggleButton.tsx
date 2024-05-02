
import { Button } from 'antd';
import classes from './ToggleButton.module.scss';
import { PropsWithChildren } from 'react';

type ToggleButtonProps = {
    onToggleChanged: (isToggled: boolean) => void;
    isToggled: boolean;
}

export function ToggleButton({ onToggleChanged, isToggled, children }: PropsWithChildren<ToggleButtonProps>) {
    return (
        <div>
            <Button onClick={() => onToggleChanged(!isToggled)} className={`${classes.button} ${isToggled ? 'toggledOn' : 'toggledOfF'}`}>{children}</Button>
        </div>
    );
}