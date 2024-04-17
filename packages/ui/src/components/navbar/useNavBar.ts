import { Icon, IconProps } from '@tabler/icons-react';
import { atom, useAtom } from 'jotai';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export type NavBarItem = {
    icon: ForwardRefExoticComponent<Omit<IconProps, "ref"> & RefAttributes<Icon>>;
    label: string;
    href: string;
};

export type NavBarConfig = {
    items: Array<NavBarItem>;
    icon: string;
};

const navBarPropsAtom = atom<NavBarConfig | undefined>(undefined);

export function useNavBar() {
    const [navBarProps, setNavBarProps] = useAtom(navBarPropsAtom);

    const setConfig = (config: NavBarConfig) => {
        setNavBarProps(config)
    }

    return { navBarProps, setConfig }
}
