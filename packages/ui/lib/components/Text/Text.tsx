import Typography from "@mui/material/Typography";
import { PropsWithChildren } from "react";

export type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "caption"
  | "button"
  | "overline";

export function Text({
  variant = "p" as Variant,
  className,
  children,
}: PropsWithChildren<{
  variant?: Variant;
  className?: string;
}>) {
  return <Typography className={className} variant={variant}>{children}</Typography>;
}
