import {
  IconAdjustmentsHorizontal,
  IconCertificate,
  IconCircles,
  IconUserPentagon,
  IconUsers,
  IconBox,
  IconBrush,
  IconSunglasses,
  IconGoGame,
  IconUserShield,
  IconUserCog,
} from '@tabler/icons-react';
import { useSideNav } from '@wanderlust/ui';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function Configure() {
  const { setSideNavConfig } = useSideNav();

  useEffect(() => {
    setSideNavConfig({
      title: 'Configure',
      menuItems: [
        {
          icon: <IconUsers className="transparent" />,
          label: 'Participants',
          path: 'configure/participants',
          menuItems: [{
            icon: <IconUserCog className="transparent" />,
            label: 'Administrators',
            path: 'configure/participants/admins',
          }, {
            icon: <IconUserShield className="transparent" />,
            label: 'Gamemasters',
            path: 'configure/participants/gamemasters',
          }, {
            icon: <IconGoGame className="transparent" />,
            label: 'Players',
            path: 'configure/participants/players',
          }, {
            icon: <IconSunglasses className="transparent" />,
            label: 'Spectators',
            path: 'configure/participants/spectators',
          }]
        },
        {
          icon: <IconUserPentagon className="transparent" />,
          label: 'Roles',
          path: 'configure/roles',
        },
        {
          icon: <IconCertificate className="transparent" />,
          label: 'Permissions',
          path: 'configure/permissions',
        },
        {
          icon: <IconCircles className="transparent" />,
          label: 'Game Systems',
          path: 'configure/systems',
        },
        {
          icon: <IconBox className="transparent" />,
          label: 'Modules',
          path: 'configure/modules',
        },
        {
          icon: <IconBrush className="transparent" />,
          label: 'Theme',
          path: 'configure/theme',
        },
        {
          icon: <IconAdjustmentsHorizontal className="transparent" />,
          label: 'Settings',
          path: 'configure/settings',
        },
      ],
    });
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  );
}
