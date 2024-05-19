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
                item.open = true;
            }
        }
    }


    return <div />;
}
