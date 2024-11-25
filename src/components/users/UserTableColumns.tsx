import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Space, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { User } from "../../services";

export const createUserColumns = (
  screens: any,
  handleViewDetail: (id: string) => void,
  handleEdit: (id: string) => void
): ColumnsType<User> => [
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
    render: (roles) => (
      <Space size={[0, 4]} wrap>
        {roles.map((role: any) => (
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
    render: (_, record) => (
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
      </Space>
    ),
  },
];
