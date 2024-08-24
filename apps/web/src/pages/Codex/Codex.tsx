import { useSideNav } from '@wanderlust/ui';
import { useEffect } from 'react';
import { IconCube, IconMap, IconSpiral, IconSword, IconUsers, IconWand } from '@tabler/icons-react';

export default function Codex() {
  const { setSideNavConfig } = useSideNav();

  useEffect(() => {
    setSideNavConfig({
      title: 'Library',
      menuItems: [
        {
          icon: <IconSpiral />,
          label: 'Races',
          path: 'codex/races',
        },
        {
          icon: <IconSword />,
          label: 'Classes',
          path: 'codex/classes',
        },
        {
          icon: <IconWand />,
          label: 'Spells',
          path: 'codex/spells',
        },
        {
          icon: <IconCube />,
          label: 'Items',
          path: 'codex/items',
        },
        {
          icon: <IconUsers />,
          label: 'Creatures',
          path: 'codex/creatures',
        },
        {
          icon: <IconMap />,
          label: 'Scenes',
          path: 'library/scenes',
        },
      ],
    });
  }, []);
  return (
    <div className={classes.codex}>
      <h1>Codex</h1>
    </div>
  );
}
