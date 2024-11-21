import {
  IconSearch
} from "@tabler/icons-react";
import { ReactNode } from "react";
import classes from "./SideNav.module.scss";
import { NavLinkProps } from "./types";
import { useSideNav } from "./useSideNav";

type SideNavProps = {
  links: NavLinkProps[];
};

export function SideNav() {
  const { links } = useSideNav();

  const mainLinks = links.map((link) => (
    <UnstyledButton key={link.label} className={classes.mainLink}>
      <div className={classes.mainLinkInner}>
        <span className={classes.mainLinkIcon}>{link.icon}</span>
        <span>{link.label}</span>
      </div>
      {link.badge && (
        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {link.badge}
        </Badge>
      )}
    </UnstyledButton>
  ));

  return (
    <nav className={classes.navbar}>
      <h3>Configuration</h3>
      <TextInput
        placeholder="Search"
        size="xs"
        leftSection={
          <IconSearch
            style={{ width: rem(12), height: rem(12) }}
            stroke={1.5}
          />
        }
        rightSectionWidth={70}
        rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
        styles={{ section: { pointerEvents: "none" } }}
        mb="sm"
      />

      <div className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </div>
    </nav>
  );
}
