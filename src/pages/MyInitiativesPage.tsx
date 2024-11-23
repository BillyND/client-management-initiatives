import React from "react";
import { Button, Grid, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import ListTable from "../components/ListTable";

const { useBreakpoint } = Grid;

interface Initiative {
  id: string;
  title: string;
  submissionDate: string;
  status: "pending" | "approved" | "rejected";
  score?: number;
}

const MyInitiativesPage: React.FC = () => {
  const screens = useBreakpoint();

  const columns: ColumnsType<Initiative> = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      width: screens.xs ? 50 : 80,
      render: (text) => text,
    },
    {
      title: "Tên sáng kiến",
      dataIndex: "initiativeName",
      key: "initiativeName",
      render: (text) => <a>{text}</a>,
      ellipsis: screens.xs,
      sorter: true,
    },
    {
      title: "Ngày nộp",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
      responsive: ["md"],
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        let text = "Đang chờ";

        switch (status) {
          case "approved":
            color = "green";
            text = "Đã duyệt";
            break;
          case "rejected":
            color = "red";
            text = "Từ chối";
            break;
        }

        return <Tag color={color}>{text}</Tag>;
      },
      sorter: true,
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
      render: (score) => score || "-",
      responsive: ["lg"],
      sorter: true,
    },
    {
      title: "Thao tác",
      key: "action",
      width: screens.xs ? 100 : "auto",
      render: (_, record) => (
        <Space size="small" direction={screens.xs ? "vertical" : "horizontal"}>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewDetail(record.id)}
          >
            Xem chi tiết
          </Button>
          {record.status === "pending" && (
            <Button
              type="link"
              size="small"
              onClick={() => handleEdit(record.id)}
            >
              Chỉnh sửa
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Đang chờ", value: "pending" },
        { label: "Đã duyệt", value: "approved" },
        { label: "Từ chối", value: "rejected" },
      ],
    },
  ];

  const handleViewDetail = (id: string) => {
    console.log("View detail:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Edit:", id);
  };

  return (
    <div style={{ padding: screens.xs ? "12px" : "24px" }}>
      <ListTable
        title="Sáng kiến của tôi"
        dataSource="initiatives"
        columns={columns}
        filters={filters}
        queryKey="initiativeName"
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        pagination={{
          showSizeChanger: !screens.xs,
          size: screens.xs ? "small" : "default",
          showTotal: (total: number) => `Tổng số ${total} sáng kiến`,
        }}
      />
    </div>
  );
};

export default MyInitiativesPage;
