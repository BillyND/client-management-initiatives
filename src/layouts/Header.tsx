import {
  LockOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Popover } from "antd";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { authService } from "../services";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

interface MainHeaderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  collapsed,
  onCollapse,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore((state) => state);
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
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: 64,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => onCollapse(!collapsed)}
        style={{ fontSize: "16px", width: 64, height: 64 }}
      />

      <Popover
        content={userMenu}
        trigger="click"
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
      >
        <Avatar size={40} style={{ cursor: "pointer" }}>
          {user?.name?.[0] || "U"}
        </Avatar>
      </Popover>
    </Header>
  );
};
