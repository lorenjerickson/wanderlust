import { IconSearch } from '@tabler/icons-react'
import classes from './header.module.scss'
import { Link } from 'react-router-dom'
import { useUserSession } from '@/hooks/useUserSession'

const links = [
    { link: '/configure', label: 'Configure' },
    { link: '/media', label: 'Media' },
    { link: '/design', label: 'Design' },
    { link: '/play', label: 'Play!' },
]

export function Header() {
    const { isLoggedIn, userSession } = useUserSession()

    const items = links.map((link) => (
        <Link
            key={link.label}
            to={link.link}
            className={classes.link}
            onClick={(event) => event.preventDefault()}
        >
            {link.label}
        </Link>
    ))

    return (
        <header className={classes.header}>
            <div className={classes.inner}>
                <Link to="/" className={classes.logo}>
                    Wanderlust
                </Link>
                <nav className={classes.nav}>
                    {items}
                    {isLoggedIn() && (
                        <Link to="/profile" className={classes.link}>
                            {userSession?.username}
                        </Link>
                    )}
                    <Link to="/search" className={classes.link}>
                        <IconSearch />
                    </Link>
                </nav>
            </div>
        </header>
    )
}
