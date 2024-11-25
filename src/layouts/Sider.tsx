import { CloseOutlined } from "@ant-design/icons";
import { Button, Drawer, Flex, Grid, Layout, Menu, Typography } from "antd";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { getMenuItems } from "./fns";

const { Sider } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

interface MainSiderProps {
  collapsed: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const MainSider: React.FC<MainSiderProps> = ({
  collapsed,
  onCollapse,
}) => {
  const screens = useBreakpoint();
  const location = useLocation();
  const { user } = useAuthStore((state) => state);
  const menuItems = useMemo(() => getMenuItems(user), [user]);

  const siderStyle = useMemo<React.CSSProperties>(
    () => ({
      position: "fixed",
      height: "100vh",
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 999,
      transform: screens.xs && collapsed ? "translateX(-100%)" : "none",
      transition: "transform 0.2s",
      background: "var(--ant-color-bg-container)",
      boxShadow: "var(--ant-boxShadow-1)",
    }),
    [screens.xs, collapsed]
  );

  const handleMenuClick = () => {
    if (screens.xs && onCollapse) {
      onCollapse(true);
    }
  };

  const logoContent = (
    <Flex align="center" justify="center" style={{ position: "relative" }}>
      <Flex
        align="center"
        justify="center"
        style={{ width: "100%", padding: 18 }}
      >
        <Link
          to="/"
          className="no-underline"
          onClick={() => screens.xs && onCollapse?.(true)}
        >
          <Title level={4} style={{ margin: 0 }}>
            {screens.xs || !collapsed ? "Sáng Kiến" : "SK"}
          </Title>
        </Link>
      </Flex>
      {screens.xs && (
        <Button
          type="text"
          shape="circle"
          icon={<CloseOutlined className="text-primary" />}
          onClick={() => onCollapse?.(true)}
          style={{
            backgroundColor: "#eaeaea",
            position: "absolute",
            right: 16,
          }}
        />
      )}
    </Flex>
  );

  const menuContent = (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      theme="light"
      style={{ borderRight: 0 }}
      onClick={handleMenuClick}
    />
  );

  if (screens.xs) {
    return (
      <Drawer
        closable
        placement="left"
        onClose={() => onCollapse?.(true)}
        open={!collapsed}
        width="100vw"
        styles={{
          body: {
            padding: 0,
            height: "100vh",
            overflow: "hidden",
          },
          header: {
            display: "none",
          },
        }}
      >
        <div
          className="p-4 text-center"
          style={{ borderBottom: "1px solid var(--ant-color-border)" }}
        >
          {logoContent}
        </div>
        {menuContent}
      </Drawer>
    );
  }

  return (
    <Sider
      theme="light"
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      style={siderStyle}
    >
      <div
        className="p-4 text-center"
        style={{ borderBottom: "1px solid var(--ant-color-border)" }}
      >
        {logoContent}
      </div>
      {menuContent}
    </Sider>
  );
};
