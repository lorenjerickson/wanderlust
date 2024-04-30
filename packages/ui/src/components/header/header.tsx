
import {
    IconCode,
    IconBook,
    IconAdjustmentsHorizontal,
    IconPhoto,
    IconChevronDown,
    IconPolaroid,
    IconTools,
    IconPlayerPlay,
    IconKeyframes,
} from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';


import classes from './header.module.scss';


export function Header() {
    const navigate = useNavigate();

    return (
        <div className={classes.header}>
            <div className={classes.logo}>
                <IconKeyframes size={24} />
                <span>Wanderlust</span>
            </div>
            <div className={classes.menu}>
                <div className={classes.menuItem} onClick={() => navigate('/configure')}>
                    <IconAdjustmentsHorizontal size={24} />
                    <span className={classes.text}>Configure</span>
                </div>
                <div className={classes.menuItem} onClick={() => navigate('/media')}>
                    <IconPhoto size={24} />
                    <span className={classes.text}>Media</span>
                </div>
                <div className={classes.menuItem} onClick={() => navigate('/design')}>
                    <IconTools size={24} />
                    <span className={classes.text}>Design</span>
                </div>
                <div className={classes.menuItem} onClick={() => navigate('/play')}>
                    <IconPlayerPlay size={24} />
                    <span className={classes.text}>Play!</span>
                </div>
            </div>
            <div className={classes.menu}>
                <Link to="/login">Login / Register</Link>
            </div>
        </div>
    );
}
