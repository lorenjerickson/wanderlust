
import { IconAdjustmentsHorizontal, IconBook, IconBooks, IconChairDirector, IconCircles, IconCode, IconCube, IconDatabase, IconGeometry, IconKeyframeAlignHorizontal, IconMap, IconMovie, IconMusic, IconPhoto, IconRecycle, IconSettings2, IconSettingsAutomation, IconSquares, IconUser, IconUsers, IconWand, IconWorld } from '@tabler/icons-react';
import { SideNav, SideNavConfig } from '@wanderlust/ui';
import { Outlet } from 'react-router-dom';
import classes from './Layout.module.scss';

const config: SideNavConfig = {
    items: [
        {
            icon: <IconSettings2 />,
            label: 'Settings',
            path: "settings",
            items: [{
                icon: <IconUsers />,
                label: "People",
                path: "configure/people"
            }, {
                icon: <IconCircles />,
                label: "Systems",
                path: "configure/systems"
            }, {
                icon: <IconWorld />,
                label: "Worlds",
                path: "configure/worlds"
            }, {
                icon: <IconAdjustmentsHorizontal />,
                label: "Defaults",
                path: "configure/settings"
            }]
        },
        {
            icon: <IconBooks />,
            label: 'library',
            path: "library",
            items: [{
                icon: <IconPhoto />,
                label: "Images",
                path: "library/images"
            }, {
                icon: <IconMovie />,
                label: "Movies",
                path: "library/movies"
            }, {
                icon: <IconMusic />,
                label: "Music",
                path: "library/music"
            }, {
                icon: <IconCode />,
                label: "Modules",
                path: "library/modules"
            }]
        },
        {
            icon: <IconGeometry />,
            label: "Design",
            path: "design",
            items: [{
                icon: <IconBook />,
                label: "Handbook",
                path: "design/handbook"
            },
            {
                icon: <IconMap />,
                label: "Scenes",
                path: "scenes"
            }, {
                icon: <IconUser />,
                label: "Actors",
                path: "design/actors"
            }, {
                icon: <IconCube />,
                label: "Items",
                path: "design/items"
            }, {
                icon: <IconWand />,
                label: "Spells",
                path: "design/spells"
            }]
        },
        {
            icon: <IconSettingsAutomation />,
            label: 'Automation',
            path: 'automation',
            items: [
                {
                    icon: <IconRecycle />,
                    label: 'Effects',
                    path: "automation/effects",
                },
                {
                    icon: <IconCode />,
                    label: 'Macros',
                    path: "automation/macros",
                },
                {
                    icon: <IconKeyframeAlignHorizontal />,
                    label: 'Animation',
                    path: "automation/animation",
                }
            ]
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