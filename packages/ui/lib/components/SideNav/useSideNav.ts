import { useMemo, useState } from "react";
import { NavLinkProps } from "./types";

export function useSideNav() {
  const [links, setLinks] = useState<NavLinkProps[]>([]);

  return useMemo(() => {
    return {
      links,
      setLinks,
    };
  }, [links]);
}
