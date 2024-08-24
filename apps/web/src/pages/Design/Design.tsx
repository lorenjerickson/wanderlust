import { useEffect } from 'react';
import { useSideNav } from '@wanderlust/ui';
import { IconBook, IconCube, IconMap, IconUser, IconWand } from '@tabler/icons-react';

export default function Design() {
  const { setSideNavConfig } = useSideNav();

  useEffect(() => {
    setSideNavConfig({
      title: 'Library',
      menuItems: [
        {
          icon: <IconBook />,
          label: 'Races',
          path: 'codex/races',
        },
        {
          icon: <IconMap />,
          label: 'Classes',
          path: 'codex/classes',
        },
        {
          icon: <IconUser />,
          label: 'Spells',
          path: 'codex/spells',
        },
        {
          icon: <IconCube />,
          label: 'Items',
          path: 'codex/items',
        },
        {
          icon: <IconWand />,
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
    <div className={classes.design}>
      <h1>Design</h1>
    </div>
  );
}
