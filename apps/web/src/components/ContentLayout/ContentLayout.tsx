import { Outlet } from 'react-router-dom';
import classes from './ContentLayout.module.scss';
import { SideNav } from '../side-nav/SideNav';

export function ContentLayout() {
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