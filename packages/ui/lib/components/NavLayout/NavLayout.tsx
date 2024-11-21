import { Outlet } from "react-router-dom";
import { SideNav } from "../SideNav/SideNav";
import classes from "./NavLayout.module.scss";

export function NavLayout() {
  return (
    <div className={classes.navContainer}>
      <SideNav />
      <Outlet />
    </div>
  );
}
