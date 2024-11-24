import { LockOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Grid, Layout, Menu, Popover, Typography } from "antd";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services";
import { useAuthStore } from "../store/useAuthStore";
import { getMenuItems } from "./fns";

const { Header } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

export const MainHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuthStore((state) => state);
  const menuItems = useMemo(() => getMenuItems(user), [user]);
  const { xs } = useBreakpoint();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      setIsPopoverOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userMenu = (
    <div style={{ width: 300 }}>
      <div style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
        <div>{user?.name || "Người dùng"}</div>
        <div style={{ fontSize: "12px", color: "#999" }}>{user?.email}</div>
      </div>
      <div style={{ padding: "4px" }}>
        <Button
          type="text"
          block
          style={{ textAlign: "left" }}
          icon={<UserOutlined />}
          onClick={() => {
            navigate("/profile");
            setIsPopoverOpen(false);
          }}
        >
          Thông tin cá nhân
        </Button>
        <Button
          type="text"
          block
          style={{ textAlign: "left" }}
          icon={<LockOutlined />}
          onClick={() => {
            navigate("/change-password");
            setIsPopoverOpen(false);
          }}
        >
          Đổi mật khẩu
        </Button>
        <Button
          type="text"
          block
          style={{ textAlign: "left" }}
          danger
          onClick={handleLogout}
          loading={isLoggingOut}
          icon={<LogoutOutlined />}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );

  return (
    <Header
      style={{
        background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        {!xs && (
          <Link to="/" style={{ textDecoration: "none", marginRight: 24 }}>
            <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
              Sáng Kiến
            </Title>
          </Link>
        )}
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, border: "none" }}
        />
      </div>

      <Popover
        content={userMenu}
        trigger="click"
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
      >
        <Avatar
          size={40}
          className="prevent-copy"
          style={{ cursor: "pointer" }}
        >
          {user?.name?.[0] || "U"}
        </Avatar>
      </Popover>
    </Header>
  );
};
