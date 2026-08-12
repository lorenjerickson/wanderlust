import { ElementType, PropsWithChildren } from "react";

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
  variant = "body1",
  className,
  children,
}: PropsWithChildren<{
  variant?: Variant;
  className?: string;
}>) {
  const classes = ["text-primary", className].filter(Boolean).join(" ");

  if (variant.startsWith("h")) {
    const Tag = variant as ElementType;
    return <Tag className={classes}>{children}</Tag>;
  }

  if (variant === "caption" || variant === "overline") {
    return <span className={classes}>{children}</span>;
  }

  return <p className={classes}>{children}</p>;
}
