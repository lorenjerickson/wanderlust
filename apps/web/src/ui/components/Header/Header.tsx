import playIcon from '../../../assets/icons/play.svg';
import settingsIcon from '../../../assets/icons/settings.svg';
import mediaIcon from '../../../assets/icons/media.svg';
import designIcon from '../../../assets/icons/design.svg';

import { useState } from 'react'
import { StyledHeader } from './Header.styles'

export function Header() {
    const [open, setOpen] = useState(false)
    const items = [
        {
            label: 'Configure',
            path: '/configure',
            icon: settingsIcon,
        },
        {
            label: 'Media',
            path: '/media',
            icon: mediaIcon,
        },
        {
            label: 'Design',
            path: '/design',
            icon: designIcon,
        },
        {
            label: 'Play',
            path: '/play',
            icon: playIcon,
        },
    ]

    return (
        <StyledHeader>
            <header>
                <div className="title">Wanderlust</div>
                <ul className="nav">
                    {items.map((item, index) => (
                        <li key={index} className="item">
                            <a href={item.path}>
                                <img className="icon" src={item.icon} alt={item.label} />
                                <div className="label">{item.label}</div>
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="session">session</div>
            </header>
        </StyledHeader>
    )
}

export default Header
