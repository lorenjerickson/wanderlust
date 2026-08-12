import { IconInbox, IconMail } from "@tabler/icons-react";
import { useSideNav } from "./useSideNav";

export function SideNav() {
  const { items, isOpen } = useSideNav();

  return (
    <aside
      className={[
        "h-full bg-base-300/80 text-base-content transition-[width]",
        isOpen ? "w-64" : "w-14",
      ].join(" ")}
    >
      <ul className="menu w-full p-2">
        {items.map(({ label }, index) => {
          const Icon = index % 2 === 0 ? IconInbox : IconMail;

          return (
            <li key={label}>
              <a className="gap-3">
                <Icon size={18} />
                {isOpen && <span>{label}</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
