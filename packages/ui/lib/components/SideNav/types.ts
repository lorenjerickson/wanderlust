import { ReactNode } from "react";

export type NavLinkProps = {
  icon: ReactNode;
  label: string;
  path: string;
  badge?: ReactNode;
};
