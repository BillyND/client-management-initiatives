import { EditOutlined, EyeOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Grid, Space, Tag, Tooltip } from "antd";
import { useCallback, useState } from "react";
import DataSourceListTable from "../components/ListTable";
import { EditUserModal } from "../components/Users/EditUserModal";
import { ViewUserModal } from "../components/Users/ViewUserModal";
import { User } from "../services";
import { UserRoleModal } from "../components/Users/UserRoleModal";
import { useTranslation } from "react-i18next";

const { useBreakpoint } = Grid;

const UserManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const [isRefetching, setIsRefetching] = useState({});
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null
  );

  const [modalVisible, setModalVisible] = useState({
    view: false,
    edit: false,
    role: false,
  });

  const handleViewDetail = useCallback((email: string) => {
    setSelectedUserEmail(email);
    setModalVisible((prev) => ({ ...prev, view: true }));
  }, []);

  const handleEdit = useCallback((email: string) => {
    setSelectedUserEmail(email);
    setModalVisible((prev) => ({ ...prev, edit: true }));
  }, []);

  const handleAssignRole = useCallback((email: string) => {
    setSelectedUserEmail(email);
    setModalVisible((prev) => ({ ...prev, role: true }));
  }, []);

  const handleCloseModal = useCallback(
    (modalType: keyof typeof modalVisible) => {
      setModalVisible((prev) => ({ ...prev, [modalType]: false }));
      setSelectedUserEmail(null);
    },
    []
  );

  const handleSuccess = useCallback(() => {
    setIsRefetching({});
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      width: screens.xs ? 50 : 80,
      ellipsis: true,
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      ellipsis: screens.xs,
      sorter: true,
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      responsive: ["md"],
      sorter: true,
    },
    {
      title: t("phone-number"),
      dataIndex: "phone",
      key: "phone",
      responsive: ["lg"],
      sorter: true,
    },
    {
      title: t("department"),
      dataIndex: "department",
      key: "department",
      responsive: ["lg"],
      sorter: true,
    },
    {
      title: t("position"),
      dataIndex: "position",
      key: "position",
      responsive: ["lg"],
      sorter: true,
    },
    {
      title: t("status"),
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive?: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? t("active") : t("locked")}
        </Tag>
      ),
      sorter: true,
    },
    {
      title: t("roles"),
      dataIndex: "roles",
      key: "roles",
      render: (roles: string[]) => (
        <Space size={[0, 4]} wrap>
          {roles.map((role: string) => (
            <Tag color="blue" key={role}>
              {role}
            </Tag>
          ))}
        </Space>
      ),
      responsive: ["xl"],
    },
    {
      title: t("actions"),
      key: "action",
      width: screens.xs ? 100 : "auto",
      render: (_: any, record: User) => (
        <Space size="small">
          <Tooltip title={t("view-details")}>
            <Button
              type="link"
              onClick={() => handleViewDetail(record.email)}
              icon={<EyeOutlined />}
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title={t("edit")}>
            <Button
              type="link"
              onClick={() => handleEdit(record.email)}
              icon={<EditOutlined />}
              style={{ color: "#52c41a" }}
            />
          </Tooltip>
          <Tooltip title={t("assign-role")}>
            <Button
              type="link"
              onClick={() => handleAssignRole(record.email)}
              icon={<UserAddOutlined />}
              style={{ color: "#faad14" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filters = [
    {
      key: "isActive",
      label: t("status"),
      options: [
        { label: t("active"), value: true },
        { label: t("locked"), value: false },
      ],
    },
    {
      key: "department",
      label: t("department"),
      options: [
        { label: t("technical-department"), value: "technical" },
        { label: t("hr-department"), value: "hr" },
        { label: t("sales-department"), value: "sales" },
      ],
    },
  ];

  return (
    <>
      <DataSourceListTable
        isRefetching={isRefetching}
        title={t("user-management")}
        dataSource="users"
        columns={columns}
        filters={filters}
        queryKey="name"
        pagination={{
          showSizeChanger: !screens.xs,
          size: screens.xs ? "small" : "default",
          showTotal: (total: number) => `${t("total")} ${total} ${t("users")}`,
        }}
      />

      <ViewUserModal
        userEmail={selectedUserEmail}
        visible={modalVisible.view}
        onClose={() => handleCloseModal("view")}
      />

      <EditUserModal
        userEmail={selectedUserEmail}
        visible={modalVisible.edit}
        onClose={() => handleCloseModal("edit")}
        onSuccess={handleSuccess}
      />

      <UserRoleModal
        userEmail={selectedUserEmail}
        visible={modalVisible.role}
        onClose={() => handleCloseModal("role")}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default UserManagementPage;
