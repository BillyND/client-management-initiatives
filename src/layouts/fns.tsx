import { Link } from "react-router-dom";
import { User } from "../services";
import { ROLES } from "../common/enums/roles.enum";
import {
  FileAddOutlined,
  FileSearchOutlined,
  UserOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  AuditOutlined,
  FolderOutlined,
} from "@ant-design/icons";

// Define interface for menu item to make the code more readable
interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

// Define mapping between role and menu items
const ROLE_MENU_ITEMS: Record<string, MenuItem[]> = {
  [ROLES.SUPER_ADMIN]: [
    {
      key: "/initiatives",
      label: <Link to="/initiatives">Quản lý sáng kiến</Link>,
      icon: <FolderOutlined />,
    },
    {
      key: "/users",
      label: <Link to="/users">Quản lý người dùng</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "/reports",
      label: <Link to="/reports">Báo cáo thống kê</Link>,
      icon: <BarChartOutlined />,
    },
    {
      key: "/evaluate",
      label: <Link to="/evaluate">Chấm điểm sáng kiến</Link>,
      icon: <CheckCircleOutlined />,
    },
    {
      key: "/review",
      label: <Link to="/review">Kiểm tra hồ sơ</Link>,
      icon: <AuditOutlined />,
    },
    {
      key: "/my-initiatives",
      label: <Link to="/my-initiatives">Sáng kiến của tôi</Link>,
      icon: <FileSearchOutlined />,
    },
    {
      key: "/submit-initiative",
      label: <Link to="/submit-initiative">Gửi sáng kiến</Link>,
      icon: <FileAddOutlined />,
    },
  ],
  [ROLES.USER]: [
    {
      key: "/my-initiatives",
      label: <Link to="/my-initiatives">Sáng kiến của tôi</Link>,
      icon: <FileSearchOutlined />,
    },
    {
      key: "/submit-initiative",
      label: <Link to="/submit-initiative">Gửi sáng kiến</Link>,
      icon: <FileAddOutlined />,
    },
  ],
  [ROLES.ADMIN]: [
    {
      key: "/initiatives",
      label: <Link to="/initiatives">Quản lý sáng kiến</Link>,
      icon: <FolderOutlined />,
    },
    {
      key: "/users",
      label: <Link to="/users">Quản lý người dùng</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "/reports",
      label: <Link to="/reports">Báo cáo thống kê</Link>,
      icon: <BarChartOutlined />,
    },
  ],
  EVALUATOR: [
    {
      key: "/evaluate",
      label: <Link to="/evaluate">Chấm điểm sáng kiến</Link>,
      icon: <CheckCircleOutlined />,
    },
  ],
  [ROLES.MANAGER]: [
    {
      key: "/reports",
      label: <Link to="/reports">Báo cáo thống kê</Link>,
      icon: <BarChartOutlined />,
    },
  ],
  SECRETARY: [
    {
      key: "/review",
      label: <Link to="/review">Kiểm tra hồ sơ</Link>,
      icon: <AuditOutlined />,
    },
  ],
};

export const getMenuItems = (user: User | null) => {
  if (!user?.roles) return [];

  // Unique menu items
  const uniqueMenuItems = new Set<string>();
  const menuItems: MenuItem[] = [];

  user.roles.forEach((role) => {
    const roleMenuItems = ROLE_MENU_ITEMS[role] || [];

    roleMenuItems.forEach((item) => {
      if (!uniqueMenuItems.has(item.key)) {
        uniqueMenuItems.add(item.key);
        menuItems.push(item);
      }
    });
  });

  return menuItems;
};
