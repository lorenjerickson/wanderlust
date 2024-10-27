import { Outlet } from 'react-router-dom';
import classes from './TopLayout.module.scss';
import { Header } from '../header';

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
