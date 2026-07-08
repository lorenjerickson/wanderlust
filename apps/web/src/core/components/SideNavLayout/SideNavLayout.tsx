import { SideNav } from "../SideNav/SideNav";

export function SideNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sideNavLayout">
      <SideNav />
      {children}
    </div>
  );
}
