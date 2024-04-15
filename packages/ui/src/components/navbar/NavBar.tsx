import { Stack, Tooltip, UnstyledButton, rem } from '@mantine/core';
import {
    IconHome2
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavBar } from './useNavBar';

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} data-active={active || undefined}>
                <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

export function NavBar() {
    const [active, setActive] = useState(2);
    const { navBarProps } = useNavBar();

    const links = navBarProps?.items ? navBarProps.items.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    )) : [];

    return (
        <nav>
            <div>
                <Stack justify="center" gap={0}>
                    {links}
                </Stack>
            </div>
        </nav>
    );
}