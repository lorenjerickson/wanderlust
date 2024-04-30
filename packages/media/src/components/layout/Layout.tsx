
import { IconBook, IconChairDirector, IconCode, IconMap, IconMovie, IconMusic, IconPhoto, IconSettings2, IconSquares, IconUser, IconWand } from '@tabler/icons-react';
import { SideNav, SideNavConfig } from '@wanderlust/ui';
import { Outlet } from 'react-router-dom';
import classes from './Layout.module.scss';

const config: SideNavConfig = {
    items: [
        {
            icon: <IconSettings2 />,
            label: 'Settings',
            path: "settings",
        },
        {
            icon: <IconBook />,
            label: 'Library',
            path: "library",
        }, {
            icon: <IconMusic />,
            label: 'Audio',
            path: "media/audio",
        },
        {
            icon: <IconMovie />,
            label: 'Video',
            path: 'media/video',
        },
        {
            icon: <IconPhoto />,
            label: 'Images',
            path: 'media/images',
        },
        {
            icon: <IconMap />,
            label: "Scenes",
            path: "scenes",
        },
        {
            icon: <IconSquares />,
            label: 'Layers',
            path: 'layers',
        },
        {
            icon: <IconUser />,
            label: "Actors",
            path: "actors",
        },
        {
            icon: <IconWand />,
            label: 'Effects',
            path: "effects",
        },
        {
            icon: <IconCode />,
            label: 'Plugins',
            path: "plugins",
        },
        {
            icon: <IconChairDirector />,
            label: 'Sequences',
            path: 'sequences',
        }
    ]
};


export function Layout() {
    return (
        <div className={classes.layout}>
            <div className={classes.sidenav}>
                <SideNav config={config} />
            </div>
            <div className={classes.content}>
                <Outlet />
            </div>
        </div>
    );
}