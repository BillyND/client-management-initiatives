import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Grid, Space, Tag, Tooltip } from "antd";
import { useCallback, useState } from "react";
import DataSourceListTable from "../components/ListTable";
import { EditUserModal } from "../components/Users/EditUserModal";
import { ViewUserModal } from "../components/Users/ViewUserModal";
import { User } from "../services";
import { UserRoleModal } from "../components/Users/UserRoleModal";

const { useBreakpoint } = Grid;

const UserManagementPage: React.FC = () => {
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
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text?: string) => <a>{text}</a>,
      ellipsis: screens.xs,
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      responsive: ["md"],
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      responsive: ["lg"],
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      responsive: ["lg"],
      sorter: true,
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
      responsive: ["lg"],
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive?: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Đang hoạt động" : "Đã khóa"}
        </Tag>
      ),
      sorter: true,
    },
    {
      title: "Vai trò",
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
      title: "Thao tác",
      key: "action",
      width: screens.xs ? 100 : "auto",
      render: (_: any, record: User) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="link"
              onClick={() => handleViewDetail(record.email)}
              icon={<EyeOutlined />}
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              onClick={() => handleEdit(record.email)}
              icon={<EditOutlined />}
              style={{ color: "#52c41a" }}
            />
          </Tooltip>
          <Tooltip title="Gán vai trò">
            <Button
              type="link"
              onClick={() => handleAssignRole(record.email)}
              icon={<EditOutlined />}
              style={{ color: "#52c41a" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filters = [
    {
      key: "isActive",
      label: "Trạng thái",
      options: [
        { label: "Đang hoạt động", value: true },
        { label: "Đã khóa", value: false },
      ],
    },
    {
      key: "department",
      label: "Phòng ban",
      options: [
        { label: "Phòng Kỹ thuật", value: "technical" },
        { label: "Phòng Nhân sự", value: "hr" },
        { label: "Phòng Kinh doanh", value: "sales" },
      ],
    },
  ];

  return (
    <>
      <DataSourceListTable
        isRefetching={isRefetching}
        title="Quản lý người dùng"
        dataSource="users"
        columns={columns}
        filters={filters}
        queryKey="name"
        pagination={{
          showSizeChanger: !screens.xs,
          size: screens.xs ? "small" : "default",
          showTotal: (total: number) => `Tổng số ${total} người dùng`,
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
