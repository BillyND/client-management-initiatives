import { Link } from "react-router-dom";
import { User } from "../services";
import { ROLES } from "../common/enums/roles.enum";

export const getMenuItems = (user: User | null) => {
  const menuItems = [];

  if (user?.roles?.includes(ROLES.USER)) {
    menuItems.push(
      {
        key: "/my-initiatives",
        label: <Link to="/my-initiatives">Sáng kiến của tôi</Link>,
      },
      {
        key: "/submit-initiative",
        label: <Link to="/submit-initiative">Gửi sáng kiến</Link>,
      }
    );
  }

  if (user?.roles?.includes(ROLES.ADMIN)) {
    menuItems.push(
      {
        key: "/initiatives",
        label: <Link to="/initiatives">Quản lý sáng kiến</Link>,
      },
      {
        key: "/users",
        label: <Link to="/users">Quản lý người dùng</Link>,
      },
      {
        key: "/reports",
        label: <Link to="/reports">Báo cáo thống kê</Link>,
      }
    );
  }

  if (user?.roles?.includes("EVALUATOR")) {
    menuItems.push({
      key: "/evaluate",
      label: <Link to="/evaluate">Chấm điểm sáng kiến</Link>,
    });
  }

  if (user?.roles?.includes(ROLES.MANAGER)) {
    menuItems.push({
      key: "/reports",
      label: <Link to="/reports">Báo cáo thống kê</Link>,
    });
  }

  if (user?.roles?.includes("SECRETARY")) {
    menuItems.push({
      key: "/review",
      label: <Link to="/review">Kiểm tra hồ sơ</Link>,
    });
  }

  console.log("===>menuItems", menuItems);

  return menuItems;
};
