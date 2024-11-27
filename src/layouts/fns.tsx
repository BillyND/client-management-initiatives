import { ROLE_MENU_ITEMS, ROLES } from "../constants/roles.constants";
import { User } from "../services";

export interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export const getMenuItems = (user: User | null) => {
  if (!user?.roles) return [];

  // Unique menu items
  const uniqueMenuItems = new Set<string>();
  const menuItems: MenuItem[] = [];

  user.roles.forEach((role: string) => {
    const roleMenuItems = ROLE_MENU_ITEMS[role as ROLES] || [];

    roleMenuItems.forEach((item) => {
      if (!uniqueMenuItems.has(item.key)) {
        uniqueMenuItems.add(item.key);
        menuItems.push(item);
      }
    });
  });

  return menuItems;
};
