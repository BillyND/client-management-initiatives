import { Grid, Layout } from "antd";
import { useState, useEffect } from "react";
import { MainHeader } from "./Header";
import { MainSider } from "./Sider";
import { useLocation } from "react-router-dom";

const { Content } = Layout;
const { useBreakpoint } = Grid;

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();
  const isMobile = screens.xs;

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  const location = useLocation();
  const isAuthPage = ["/auth"].includes(location.pathname);

  if (isAuthPage) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#EFF2F5" }}>
        {children}
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MainSider collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 260,
          transition: "all 0.2s",
          width: "100%",
        }}
      >
        <MainHeader collapsed={collapsed} onCollapse={setCollapsed} />
        <Content
          style={{
            margin: isMobile ? "12px 8px" : "24px 16px",
            padding: isMobile ? 12 : 24,
            background: "#fff",
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
