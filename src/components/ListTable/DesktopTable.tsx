import { Table } from "antd";
import React from "react";
import { SharedTableProps } from "./index";

export const DesktopTable: React.FC<SharedTableProps> = ({
  items,
  loading,
  columns,
}) => {
  return (
    <Table
      columns={columns}
      dataSource={items}
      loading={loading}
      rowKey={(record) => record.id || record._id}
      pagination={false}
    />
  );
};
