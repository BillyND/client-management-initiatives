import React from "react";
import { Table } from "antd";
import useStore from "../store/useStore";

const InitiativeListPage: React.FC = () => {
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
  ];

  return <Table columns={columns} dataSource={initiatives} />;
};

export default InitiativeListPage;
