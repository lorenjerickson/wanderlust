import { Autocomplete, Group, rem } from "@mantine/core";
import { IconCompass, IconComponents, IconSearch } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./header.module.scss";

const links = [
  { link: "/configure", label: "Configure" },
  { link: "/media", label: "Assets" },
  { link: "/build", label: "Build" },
  { link: "/play", label: "Play!" },
];

export function Header() {
  const items = links.map((link) => (
    <Link key={link.label} to={link.link} className={classes.link}>
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <IconCompass />
          <h3>Wanderlust</h3>
        </Group>

        <Group>
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
          <Autocomplete
            className={classes.search}
            placeholder="Search"
            leftSection={
              <IconSearch
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            data={[
              "React",
              "Angular",
              "Vue",
              "Next.js",
              "Riot.js",
              "Svelte",
              "Blitz.js",
            ]}
            visibleFrom="xs"
          />
        </Group>
      </div>
    </header>
  );
}
