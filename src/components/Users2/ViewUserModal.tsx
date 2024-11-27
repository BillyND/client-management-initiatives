import React, { useEffect, useState } from "react";
import { Modal, Space, Tag, Spin, message, Descriptions } from "antd";
import { User } from "../../services";
import { userService } from "../../services/userService";

interface ViewUserModalProps {
  userEmail: string | null;
  visible: boolean;
  onClose: () => void;
}

export const ViewUserModal: React.FC<ViewUserModalProps> = ({
  userEmail,
  visible,
  onClose,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userEmail || !visible) {
        setUser(null);
        return;
      }

      try {
        setLoading(true);
        const userData = await userService.getUserByEmail(userEmail);
        const {
          _id,
          name,
          email,
          phone,
          department,
          position,
          isActive,
          roles = [],
        } = userData;

        setUser({
          _id,
          name,
          email,
          phone,
          department,
          position,
          isActive,
          roles,
        });
      } catch (error) {
        console.error(error);
        message.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userEmail, visible]);

  return (
    <Modal
      title="Chi tiết người dùng"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      ) : user ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{user._id}</Descriptions.Item>
          <Descriptions.Item label="Họ và tên">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {user.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Phòng ban">
            {user.department}
          </Descriptions.Item>
          <Descriptions.Item label="Chức vụ">{user.position}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={user.isActive ? "green" : "red"}>
              {user.isActive ? "Đang hoạt động" : "Đã khóa"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Space size={[0, 4]} wrap>
              {user.roles.map((role) => (
                <Tag color="blue" key={role}>
                  {role}
                </Tag>
              ))}
            </Space>
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Không tìm thấy thông tin người dùng
        </div>
      )}
    </Modal>
  );
};
