import { Card, Flex, List, Space, Typography } from "antd";
import { ColumnType } from "antd/es/table";
import React from "react";
import { SharedTableProps } from "./index";

export const MobileTable: React.FC<SharedTableProps> = ({
  items,
  loading,
  columns,
}) => {
  const renderListItem = (item: any) => (
    <List.Item>
      <Card style={{ width: "100%", padding: 12 }}>
        {columns.map((column, index) => {
          const { dataIndex, title, render } = column as ColumnType<any>;
          const value = render
            ? render(item[dataIndex as string], item, index)
            : item[dataIndex as string];

          return (
            <Flex
              key={index}
              justify="space-between"
              style={{ paddingBottom: "10px" }}
            >
              <Typography.Text type="secondary">
                {title as string}:
              </Typography.Text>
              <Space direction="horizontal">{value}</Space>
            </Flex>
          );
        })}
      </Card>
    </List.Item>
  );

  return (
    <List
      dataSource={items}
      loading={loading}
      renderItem={renderListItem}
      rowKey={(record) => record.id || record._id}
      pagination={false}
    />
  );
};
