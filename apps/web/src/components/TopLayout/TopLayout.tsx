import { Header } from '@wanderlust/ui';
import { Outlet } from 'react-router-dom';

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
