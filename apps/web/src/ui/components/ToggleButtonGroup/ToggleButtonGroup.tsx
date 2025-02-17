import { ReactNode } from 'react'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'

type ToggleButtonGroupProps = {
    buttons: Array<{
        icon: ReactNode
        value: string
    }>
    onChange: (value: string) => void
}

export function ToggleButtonGroup({
    buttons,
    onChange,
}: ToggleButtonGroupProps) {
    return (
        <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
        >
            {buttons.map((option) => (
                <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                />
            ))}
        </RadioGroup>
    )
}
