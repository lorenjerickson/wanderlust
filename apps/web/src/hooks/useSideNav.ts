import { atom, useAtom } from 'jotai';
import { ReactNode } from 'react';


export interface MenuItemConfig {
    icon: ReactNode;
    label: string;
    path: string;
    menuItems?: Array<MenuItemConfig>;
}   

export interface SideNavConfig {
    title?: string;
    menuItems?: Array<MenuItemConfig>;
}

const sideNavConfigAtom = atom<SideNavConfig>({});

export const useSideNav = () => {
    const [sideNavConfig, setSideNavConfig] = useAtom(sideNavConfigAtom);
    return {
        sideNavConfig,
        setSideNavConfig
    };
};