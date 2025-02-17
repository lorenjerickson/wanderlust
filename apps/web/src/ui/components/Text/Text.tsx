export function Text({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
