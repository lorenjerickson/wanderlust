export type Role = {
  name: string;
  description: string;
  permissions: Record<string, boolean>;
};
