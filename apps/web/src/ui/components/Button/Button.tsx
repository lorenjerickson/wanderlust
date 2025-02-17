import { MouseEvent } from 'react'
import '../../theme/theme.scss'
import { StyledButton } from './Button.styles'

type ButtonProps = {
    onClick: (e: MouseEvent) => void
    children: React.ReactNode
    className?: string
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
}

export function Button({
    children,
    onClick,
    className = '',
    type = 'button',
    variant = 'primary',
}: ButtonProps) {
    return (
        <StyledButton
            className={`button ${variant} ${className}`}
            onClick={onClick}
            type={type}
        >
            {children}
        </StyledButton>
    )
}

export default Button
