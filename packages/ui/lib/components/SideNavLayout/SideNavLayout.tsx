import { Outlet } from "react-router";
import { SideNav } from "../SideNav/SideNav";

export function SideNavLayout() {
  return (
    <div className="sideNavLayout">
      <SideNav />
      <Outlet />
    </div>
  );
}
