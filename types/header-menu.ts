export type MenuItem = {
  id: number;
  title: string;
  path: string;
  isActive: boolean;
  submenu?: MenuItem[];
};
