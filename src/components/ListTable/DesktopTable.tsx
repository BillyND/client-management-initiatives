import { Table } from "antd";
import React from "react";
import { SharedTableProps } from ".";

export const DesktopTable: React.FC<SharedTableProps> = ({
  items,
  loading,
  columns,
  handleTableChange,
}) => {
  return (
    <Table
      onChange={handleTableChange}
      columns={columns}
      dataSource={items}
      loading={loading}
      rowKey={(record) => record.id || record._id}
      pagination={false}
    />
  );
};
