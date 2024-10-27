import { useEffect } from 'react';
import {
  IconCode,
  IconKeyframeAlignHorizontal,
  IconMap,
  IconMovie,
  IconMusic,
  IconPhoto,
  IconRecycle,
} from '@tabler/icons-react';
import { useSideNav } from '@/hooks/useSideNav';

import classes from './Media.module.css';

export default function Media() {
  const { setSideNavConfig } = useSideNav();

  useEffect(() => {
    setSideNavConfig({
      title: 'media',
      menuItems: [
        {
          icon: <IconPhoto />,
          label: 'Images',
          path: 'media/images',
        },
        {
          icon: <IconMovie />,
          label: 'Video',
          path: 'media/video',
        },
        {
          icon: <IconMusic />,
          label: 'Music',
          path: 'media/music',
        },
        {
          icon: <IconCode />,
          label: 'Modules',
          path: 'media/modules',
        },
        {
          icon: <IconCode />,
          label: 'Macros',
          path: 'media/macros',
        },
        {
          icon: <IconRecycle />,
          label: 'Effects',
          path: 'media/effects',
        },
        {
          icon: <IconKeyframeAlignHorizontal />,
          label: 'Animation',
          path: 'media/animation',
        },
      ],
    });
  }, []);

  return (
    <div className={classes.media}>
      <h1>Media</h1>
    </div>
  );
}
