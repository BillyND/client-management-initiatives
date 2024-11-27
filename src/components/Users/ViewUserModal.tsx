import React, { useEffect, useState } from "react";
import { Modal, Space, Tag, Spin, message, Descriptions } from "antd";
import { User } from "../../services";
import { userService } from "../../services/userService";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        message.error(t("unable-to-load-user-information"));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [t, userEmail, visible]);

  return (
    <Modal
      title={t("user-details")}
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
          <Descriptions.Item label={t("id")}>{user._id}</Descriptions.Item>
          <Descriptions.Item label={t("full-name")}>
            {user.name}
          </Descriptions.Item>
          <Descriptions.Item label={t("email")}>{user.email}</Descriptions.Item>
          <Descriptions.Item label={t("phone-number")}>
            {user.phone}
          </Descriptions.Item>
          <Descriptions.Item label={t("department")}>
            {user.department}
          </Descriptions.Item>
          <Descriptions.Item label={t("position")}>
            {user.position}
          </Descriptions.Item>
          <Descriptions.Item label={t("status")}>
            <Tag color={user.isActive ? "green" : "red"}>
              {user.isActive ? t("active") : t("locked")}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t("roles")}>
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
          {t("user-information-not-found")}
        </div>
      )}
    </Modal>
  );
};
