import { Grid } from "antd";
import { useState } from "react";
import DataSourceListTable from "../components/ListTable";
import { EditUserModal } from "../components/users/EditUserModal";
import { createUserColumns } from "../components/users/UserTableColumns";
import { ViewUserModal } from "../components/users/ViewUserModal";

const { useBreakpoint } = Grid;

const UserManagementPage: React.FC = () => {
  const screens = useBreakpoint();
  const [isRefetching, setIsRefetching] = useState({});

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null
  );

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

  const handleViewDetail = (email: string) => {
    setSelectedUserEmail(email);
    setViewModalVisible(true);
  };

  const handleEdit = (email: string) => {
    setSelectedUserEmail(email);
    setEditModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setViewModalVisible(false);
    setSelectedUserEmail(null);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedUserEmail(null);
  };

  const columns = createUserColumns(screens, handleViewDetail, handleEdit);

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
        visible={viewModalVisible}
        onClose={handleCloseViewModal}
      />
      <EditUserModal
        userEmail={selectedUserEmail}
        visible={editModalVisible}
        onClose={handleCloseEditModal}
        onSuccess={() => setIsRefetching({})}
      />
    </>
  );
};

export default UserManagementPage;
