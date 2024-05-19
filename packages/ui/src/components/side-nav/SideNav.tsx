import { ReactNode, useState } from 'react';

import classes from './SideNav.module.scss';

export type NavItem = {
    icon: ReactNode;
    open?: boolean;
    label: string;
    path?: string;
    items?: Array<NavItem>;
}

export type SideNavConfig = {
    items: Array<NavItem>;
}

export function SideNav({ config }: { config: SideNavConfig }) {
    const [currentNav, setCurrentNav] = useState(0);
    const handleNavClick = (index: number) => {
        const item = config.items[index];
        if (item) {
            if (index === currentNav) {
                item.open = !item.open;
                return;
            } else {
                setCurrentNav(index);
                config.items.forEach(item => item.open = false);
                item.open = true;
            }
        }
    }

    return (

        <div className={classes.sidenav}>
            <div className={classes.menu}>
                <nav>
                    <div>
                        {config.items.map((item, index) => (
                            <div key={index} onClick={() => handleNavClick(index)}>
                                <div className={classes.item}><span className={classes.icon}>{item.icon}</span> <span className={classes.label}>{item.label}</span></div>
                                {item.items && item.open && <div className={classes.submenu}>
                                    {item.items.map(subitem => <div >
                                        <div className={classes.item}><span className={classes.icon}>{subitem.icon}</span> <span className={classes.label}>{subitem.label}</span></div>
                                    </div>)}
                                </div>}
                            </div>
                        ))}
                    </div>
                </nav>

            </div>
        </div>
    )
}


