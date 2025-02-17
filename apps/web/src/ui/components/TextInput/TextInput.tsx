import { StyledTextInput } from './TextInput.styles'

type TextInputProps = {
    type?: string
    id?: string
    name: string
    placeholder?: string
    value?: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    leading?: React.ReactNode
    trailing?: React.ReactNode
    className?: string
    required?: boolean
}

export function TextInput(props: TextInputProps) {
    const {
        id,
        name,
        placeholder = '',
        value,
        onChange,
        type = 'text',
        className = '',
        required = false,
    } = props
    return (
        <StyledTextInput>
            <input
                type={type || 'text'}
                onChange={onChange}
                placeholder={placeholder}
                id={id}
                name={name}
                value={value}
                className={className}
                required={required}
            />
        </StyledTextInput>
    )
}
