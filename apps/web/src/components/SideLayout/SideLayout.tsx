import { SideNav } from '@wanderlust/ui';
import { Outlet } from 'react-router-dom';
import classes from './SideLayout.module.scss';

export function SideLayout() {
  return (
    <div className={classes.sideLayout}>
      <div className={classes.nav}>
        <SideNav /> 
      </div>
      <div className={classes.content}>
        <Outlet />
      </div>
    </div>
  );
}