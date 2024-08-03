import {
  IconAdjustmentsHorizontal,
  IconCertificate,
  IconCircles,
  IconUserPentagon,
  IconUsers,
  IconBox,
  IconBrush,
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
          icon: <IconUsers />,
          label: 'Participants',
          path: 'configure/participants',
        },
        {
          icon: <IconUserPentagon />,
          label: 'Roles',
          path: 'configure/roles',
        },
        {
          icon: <IconCertificate />,
          label: 'Permissions',
          path: 'configure/permissions',
        },
        {
          icon: <IconCircles />,
          label: 'Game Systems',
          path: 'configure/systems',
        },
        {
          icon: <IconBox />,
          label: 'Modules',
          path: 'configure/modules',
        },
        {
          icon: <IconBrush />,
          label: 'Theme',
          path: 'configure/theme',
        },
        {
          icon: <IconAdjustmentsHorizontal />,
          label: 'Settings',
          path: 'configure/settings',
        },
      ],
    });
  }, []);

  return (
    <div className={classes.configure}>
      <Outlet />
    </div>
  );
}
