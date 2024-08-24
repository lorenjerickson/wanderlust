import { Header } from '@wanderlust/ui';
import { Outlet } from 'react-router-dom';
import classes from './TopLayout.module.scss';

export function TopLayout() {
  return (
    <>
      <Header />
      <div className={classes.layout}>
        <Outlet />
      </div>
    </>
  );
}
