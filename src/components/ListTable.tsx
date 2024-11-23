import { FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Input,
  Popover,
  Radio,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import type { WithDataSourceChildProps } from "../hoc/withDataSource";
import withDataSource from "../hoc/withDataSource";

export interface ListTableProps extends WithDataSourceChildProps {
  columns: ColumnsType<any>;
  filters?: {
    key: string;
    label: string;
    options: { label: string; value: any }[];
  }[];
  onViewDetail?: (record: any) => void;
  onEdit?: (record: any) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
const ListTable: React.FC<ListTableProps> = ({
  items,
  loading,
  columns,
  filters,
  pagination,
  setPagination,
  filterValues,
  setFilterValues,
  sort,
  setSort,
  onViewDetail,
  onEdit,
  title,
  selectedFilters,
}) => {
  const [searchText, setSearchText] = useState("");
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedSortField, setSelectedSortField] = useState<string | null>(
    null
  );

  // Khởi tạo giá trị filter từ prop
  useEffect(() => {
    if (selectedFilters) {
      setFilterValues({ ...filterValues, ...selectedFilters });
      setActiveFilters(
        Object.entries(selectedFilters).reduce((acc, [key, value]) => {
          const filter = filters?.find((f) => f.key === key);
          const option = filter?.options.find((opt) => opt.value === value);
          if (option) {
            acc[key] = option.label;
          }
          return acc;
        }, {} as { [key: string]: string })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setFilterValues({ ...filterValues, queryValue: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handleTableChange = (newPagination: any, filters: any, sorter: any) => {
    setPagination(newPagination);

    if (sorter.field && sorter.order) {
      setSort([`${sorter.field} ${sorter.order}`]);
      setSelectedSortField(sorter.field);
    } else {
      setSort([]);
      setSelectedSortField(null);
    }
  };

  const handleFilterClick = (
    filterKey: string,
    option: { label: string; value: any }
  ) => {
    const newFilterValues = {
      ...filterValues,
      [filterKey]: option.value,
    };
    setFilterValues(newFilterValues);
    setActiveFilters({
      ...activeFilters,
      [filterKey]: option.label,
    });
    setPagination({ ...pagination, current: 1 });
  };

  const handleClearFilter = (filterKey: string) => {
    const newFilterValues = { ...filterValues };
    delete newFilterValues[filterKey];
    setFilterValues(newFilterValues);

    const newActiveFilters = { ...activeFilters };
    delete newActiveFilters[filterKey];
    setActiveFilters(newActiveFilters);
  };

  const SortPopoverContent = () => (
    <div style={{ padding: "8px", minWidth: "200px" }}>
      {columns
        .filter((col) => col.sorter)
        .map((col: any = {}) => (
          <div key={col?.key} style={{ marginBottom: "8px" }}>
            <Typography.Text strong>Sắp xếp theo {col?.title}:</Typography.Text>
            <Radio.Group
              onChange={(e) => {
                setSort([`${col.key} ${e.target.value}`]);
                setSelectedSortField(col.key as string);
              }}
              value={
                sort?.[0]?.includes(col.key as string)
                  ? sort[0].split(" ")[1]
                  : undefined
              }
              style={{ marginTop: "4px" }}
            >
              <Space direction="vertical">
                <Radio value="ascend">Tăng dần</Radio>
                <Radio value="descend">Giảm dần</Radio>
              </Space>
            </Radio.Group>
          </div>
        ))}
    </div>
  );

  const renderActiveFilters = () => {
    return Object.entries(activeFilters).map(([key, value]) => (
      <Tag
        key={key}
        closable
        onClose={() => handleClearFilter(key)}
        style={{ marginRight: 8, marginBottom: 8 }}
      >
        {filters?.find((f) => f.key === key)?.label}: {value}
      </Tag>
    ));
  };

  return (
    <Card>
      {title && (
        <Typography.Title level={4} style={{ marginBottom: 16 }}>
          {title}
        </Typography.Title>
      )}

      <Space direction="vertical" style={{ width: "100%" }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input.Search
            placeholder="Tìm kiếm..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Tooltip
            title={
              selectedSortField
                ? `Đang sắp xếp theo: ${
                    columns.find((col) => col.key === selectedSortField)?.title
                  }`
                : "Sắp xếp"
            }
          >
            <Popover
              content={<SortPopoverContent />}
              title="Sắp xếp"
              trigger="click"
              placement="bottomLeft"
            >
              <Button
                icon={<SortAscendingOutlined />}
                type={selectedSortField ? "primary" : "default"}
              >
                Sắp xếp
              </Button>
            </Popover>
          </Tooltip>

          {filters && (
            <Dropdown
              menu={{
                items: filters.map((filter) => ({
                  key: filter.key,
                  label: filter.label,
                  children: filter.options.map((opt) => ({
                    key: `${filter.key}-${opt.value}`,
                    label: opt.label,
                    onClick: () => handleFilterClick(filter.key, opt),
                  })),
                })),
              }}
            >
              <Button
                icon={<FilterOutlined />}
                type={
                  Object.keys(activeFilters).length > 0 ? "primary" : "default"
                }
              >
                Lọc
              </Button>
            </Dropdown>
          )}
        </Space>

        {Object.keys(activeFilters).length > 0 && (
          <Space wrap style={{ marginBottom: 16 }}>
            <Typography.Text strong>Bộ lọc đang áp dụng:</Typography.Text>
            {renderActiveFilters()}
          </Space>
        )}

        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={{
            ...pagination,
            showTotal: (total) => `Tổng số ${total} bản ghi`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          onChange={handleTableChange}
          rowKey={(record) => record.id || record._id}
          size="middle"
        />
      </Space>
    </Card>
  );
};

export default withDataSource(ListTable);
