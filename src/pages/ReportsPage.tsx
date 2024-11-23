import React from "react";
import { Table, Button } from "antd";
import useStore from "../store/useStore";

const ReportsPage: React.FC = () => {
  const initiatives = useStore((state) => state.initiatives);

  const columns = [
    { title: "Mã sáng kiến", dataIndex: "id", key: "id" },
    {
      title: "Tên sáng kiến",
      dataIndex: "initiativeName",
      key: "initiativeName",
    },
    { title: "Người gửi", dataIndex: "name", key: "name" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Điểm số", dataIndex: "totalScore", key: "totalScore" },
  ];

  const exportReport = () => {
    // Implement report export functionality
    console.log("Đang xuất báo cáo...");
  };

  return (
    <>
      <Table columns={columns} dataSource={initiatives} />
      <Button
        onClick={exportReport}
        type="primary"
        style={{ marginTop: "20px" }}
      >
        Xuất báo cáo
      </Button>
    </>
  );
};

export default ReportsPage;
