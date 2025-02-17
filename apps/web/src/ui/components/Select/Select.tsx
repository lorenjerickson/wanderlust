import { StyledSelect } from './Select.styles'
import '../../theme/theme.scss'
import { ChangeEvent } from 'react'

type OptionValue = {
    value: string
    label: string
}

type SelectProps = {
    name: string
    id: string
    options: OptionValue[]
    className?: string
    value?: string
    label: string
    onChange: (event: ChangeEvent) => void
}

export function Select(props: SelectProps) {
    const {
        name,
        id,
        options,
        onChange,
        value,
    } = props

    return (
        <StyledSelect>
            <select name={name} id={id} onChange={onChange} value={value}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </StyledSelect>
    )
}

export default Select;