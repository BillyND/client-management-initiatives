import { Button, Grid, Space, message } from "antd";
import { useCallback, useState } from "react";
import DataSourceListTable from "../components/ListTable";
import { EditRoleModal } from "../components/Roles/EditRoleModal";
import { RolePermissionModal } from "../components/Roles/RolePermissionModal";

// Define interfaces
interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface TableRefetch {
  timestamp?: number;
}

const { useBreakpoint } = Grid;

const RoleManagementPage: React.FC = () => {
  const screens = useBreakpoint();

  // State management with clear data type
  const [isRefetching, setIsRefetching] = useState<TableRefetch>({});
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [permissionModalVisible, setPermissionModalVisible] =
    useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // Handlers with useCallback for performance optimization
  const handleEdit = useCallback((roleId: string) => {
    setSelectedRoleId(roleId);
    setEditModalVisible(true);
  }, []);

  const handlePermissions = useCallback((roleId: string) => {
    setSelectedRoleId(roleId);
    setPermissionModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setEditModalVisible(false);
    setPermissionModalVisible(false);
    setSelectedRoleId(null);
  }, []);

  const handleSuccess = useCallback(() => {
    setIsRefetching({ timestamp: Date.now() });
    message.success("Thao tác thành công!");
  }, []);

  // Define columns with full data type
  const columns = [
    {
      title: "Tên vai trò",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "30%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "40%",
    },
    {
      title: "Thao tác",
      key: "action",
      width: "30%",
      render: (_: unknown, record: Role) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record.id)}>
            Sửa
          </Button>
          <Button onClick={() => handlePermissions(record.id)}>
            Phân quyền
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="role-management-page">
      <DataSourceListTable
        isRefetching={isRefetching}
        title="Quản lý vai trò"
        dataSource="roles"
        columns={columns}
        queryKey="name"
        pagination={{
          showSizeChanger: !screens.xs,
          size: screens.xs ? "small" : "default",
          showTotal: (total: number) => `Tổng số ${total} vai trò`,
        }}
        addButton={{
          text: "Thêm vai trò",
          onClick: () => {
            setSelectedRoleId(null);
            setEditModalVisible(true);
          },
        }}
      />

      {/* Edit role modal */}
      <EditRoleModal
        roleId={selectedRoleId}
        visible={editModalVisible}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      {/* Permission modal */}
      <RolePermissionModal
        roleId={selectedRoleId}
        visible={permissionModalVisible}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default RoleManagementPage;
