import {
  IconBrush,
  IconCompass,
  IconMenu2,
  IconPhoto,
  IconPlayerPlay,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const pages = [
  {
    label: "Configure",
    path: "/configure",
    icon: <IconSettings size={18} />,
  },
  {
    label: "Media",
    path: "/media",
    icon: <IconPhoto size={18} />,
  },
  {
    label: "Design",
    path: "/design",
    icon: <IconBrush size={18} />,
  },
  {
    label: "Play",
    path: "/play",
    icon: <IconPlayerPlay size={18} />,
  },
];

export function Header() {
  return (
    <div className="navbar min-h-14 bg-base-300 px-4 text-base-content shadow-sm">
      <div className="navbar-start">
        <div className="dropdown md:hidden">
          <button
            type="button"
            tabIndex={0}
            className="btn btn-ghost btn-square"
            aria-label="Open navigation"
          >
            <IconMenu2 size={22} />
          </button>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-50 mt-3 w-52 rounded-box bg-base-200 p-2 shadow"
          >
            {pages.map((page) => (
              <li key={page.label}>
                <a href={page.path}>
                  {page.icon}
                  {page.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost gap-2 text-lg font-bold tracking-normal">
          <IconCompass size={22} />
          Wanderlust
        </Link>
      </div>

      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal gap-1 px-1">
          {pages.map((page) => (
            <li key={page.label}>
              <a href={page.path}>
                {page.icon}
                {page.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <button
            type="button"
            tabIndex={0}
            className="avatar btn btn-ghost btn-circle"
            aria-label="Open account menu"
          >
            <div className="w-9 rounded-full bg-primary text-primary-content">
              <span className="flex h-full items-center justify-center text-sm font-semibold">
                W
              </span>
            </div>
          </button>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-50 mt-3 w-52 rounded-box bg-base-200 p-2 shadow"
          >
            {settings.map((setting) => (
              <li key={setting}>
                <button type="button">{setting}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
