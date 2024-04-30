import { List } from 'antd';
import { ReactNode, useState } from 'react';

import classes from './SideNav.module.scss';

export type SideNavConfig = {
    items: Array<{
        icon: ReactNode;
        label: string;
        path: string;
    }>;
}

export function SideNav({ config }: { config: SideNavConfig }) {
    const [currentNav, setCurrentNav] = useState(0);
    const [open, setOpen] = useState(false);
    const handleNavClick = (index: number) => {
        setCurrentNav(index);
        setOpen(true);
    }
    const onClose = () => setOpen(false);

    return (

        <div className={classes.sidenav}>
            <List className={classes.minilist}>
                {config.items.map((item, index) => (
                    <List.Item key={index} className={classes.item} onClick={() => handleNavClick(index)}>
                        <div className={classes.icon}>{item.icon}</div>
                    </List.Item>
                ))}
            </List>

        </div>

    )
}


