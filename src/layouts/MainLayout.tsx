import { Layout, Menu, Typography } from "antd";
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import useBreakpoints from "../hooks/useBreakpoints";
import { getMenuItems } from "./fns";

const { Header, Content } = Layout;
const { Title } = Typography;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isMobile } = useBreakpoints();
  const { user } = useAuthStore((state) => state);
  const isAuthPage = ["/auth"].includes(location.pathname);
  const menuItems = useMemo(() => getMenuItems(user), [user]);

  if (isAuthPage) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <Content
          style={{
            padding: 24,
            margin: "24px auto",
            maxWidth: 1200,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {children}
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Header
        style={{
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          width: "100%",
        }}
      >
        {!isMobile && (
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className="logo" style={{ marginRight: 40 }}>
              <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                Sáng Kiến
              </Title>
            </div>
          </Link>
        )}
        <Menu
          mode={"horizontal"}
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            flex: 1,
            borderBottom: "none",
            backgroundColor: "transparent",
          }}
        />
      </Header>
      <Layout style={{ padding: "24px", background: "#f5f5f5" }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
