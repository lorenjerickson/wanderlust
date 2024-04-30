import { atom, useAtom } from 'jotai';
import { ReactNode } from 'react';


interface MenuItemConfig {
    icon: ReactNode;
    label: string;
    path: string;
    menuItems?: Array<MenuItemConfig>;
}   

interface SideNavConfig {
    title: string;
    menuItems: Array<MenuItemConfig>;
}

const sideNavConfigAtom = atom({});

const useSideNav = () => {
    const [sideNavConfig, setSideNavConfig] = useAtom(sideNavConfigAtom);
    return {
        sideNavConfig,
        setSideNavConfig
    };
};