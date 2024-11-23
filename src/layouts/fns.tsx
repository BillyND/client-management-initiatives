import { Link } from "react-router-dom";
import { User } from "../services";

export const getMenuItems = (user: User | null) => {
  const menuItems = [];

  switch (user?.role) {
    case "user":
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
      break;

    case "admin":
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
      break;

    case "evaluator":
      menuItems.push({
        key: "/evaluate",
        label: <Link to="/evaluate">Chấm điểm sáng kiến</Link>,
      });
      break;

    case "manager":
      menuItems.push({
        key: "/reports",
        label: <Link to="/reports">Báo cáo thống kê</Link>,
      });
      break;

    case "secretary":
      menuItems.push({
        key: "/review",
        label: <Link to="/review">Kiểm tra hồ sơ</Link>,
      });
      break;

    default:
      break;
  }

  return menuItems;
};
