import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import useStore from "../store/useStore";

const { Header, Content } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const user = useStore((state) => state.user);
  const isAuthPage = ["/auth"].includes(location.pathname);

  if (isAuthPage) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    );
  }

  // Menu items based on user role
  const getMenuItems = () => {
    const menuItems = [
      {
        key: "/",
        label: <Link to="/">Trang chủ</Link>,
      },
    ];

    // User menu items
    if (user?.role === "user") {
      menuItems.push(
        {
          key: "/submit",
          label: <Link to="/submit">Gửi sáng kiến</Link>,
        },
        {
          key: "/my-initiatives",
          label: <Link to="/my-initiatives">Sáng kiến của tôi</Link>,
        }
      );
    }

    // Admin menu items
    if (user?.role === "admin") {
      menuItems.push(
        {
          key: "/initiatives",
          label: <Link to="/initiatives">Quản lý sáng kiến</Link>,
        },
        {
          key: "/users",
          label: <Link to="/users">Quản lý người dùng</Link>,
        }
      );
    }

    // Evaluator menu items
    if (user?.role === "evaluator") {
      menuItems.push({
        key: "/evaluate",
        label: <Link to="/evaluate">Chấm điểm sáng kiến</Link>,
      });
    }

    // Admin and Manager menu items
    if (user?.role === "admin" || user?.role === "manager") {
      menuItems.push({
        key: "/reports",
        label: <Link to="/reports">Báo cáo thống kê</Link>,
      });
    }

    // Secretary menu items
    if (user?.role === "secretary") {
      menuItems.push({
        key: "/review",
        label: <Link to="/review">Kiểm tra hồ sơ</Link>,
      });
    }

    return menuItems;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
        />
      </Header>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
