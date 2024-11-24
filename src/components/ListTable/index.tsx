import { FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Dropdown,
  Flex,
  Input,
  Pagination,
  Popover,
  Radio,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import withDataSource, {
  WithDataSourceChildProps,
} from "../../hoc/withDataSource";
import useBreakpoints from "../../hooks/useBreakpoints";
import { DesktopTable } from "./DesktopTable";
import { MobileTable } from "./MobileTable";

export interface ListTableProps extends WithDataSourceChildProps {
  title?: string;
  columns: ColumnsType<any>;
  filters?: {
    key: string;
    label: string;
    options: { label: string; value: any }[];
  }[];
  onViewDetail?: (record: any) => void;
  onEdit?: (record: any) => void;
}

export interface SharedTableProps {
  items: any[];
  loading: boolean;
  columns: ColumnsType<any>;
}

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
  title,
}) => {
  // Shared states
  const [searchText, setSearchText] = useState("");
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedSortField, setSelectedSortField] = useState<string | null>(
    null
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
    setFilterValues({ ...filterValues, queryValue: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handleTableChange = (newPagination: any, _: any, sorter: any) => {
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
    setFilterValues({ ...filterValues, [filterKey]: option.value });
    setActiveFilters({ ...activeFilters, [filterKey]: option.label });
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

  const renderActiveFilters = () => {
    return Object.entries(activeFilters).map(([key, value]) => (
      <Tag key={key} closable onClose={() => handleClearFilter(key)}>
        {filters?.find((f) => f.key === key)?.label}: {value}
      </Tag>
    ));
  };

  const SortPopoverContent = () => (
    <div style={{ minWidth: "200px" }}>
      {columns
        .filter((col) => col?.sorter)
        .map((col) => {
          const { key, title } = col || {};
          return (
            <div
              key={key}
              style={{
                padding: "8px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Checkbox.Group
                onChange={(checkedValue) => {
                  if (checkedValue.includes(key as string)) {
                    setSelectedSortField(key as string);
                    setSort([`${key} ${sort?.[0]?.split(" ")[1] || "asc"}`]);
                  } else {
                    setSelectedSortField(null);
                    setSort([]);
                  }
                }}
                value={selectedSortField === key ? [key] : []}
                style={{ fontSize: "14px", color: "#262626" }}
              >
                <Checkbox value={key}>{title as string}</Checkbox>
              </Checkbox.Group>
            </div>
          );
        })}

      <div style={{ padding: "8px", borderTop: "1px solid #f0f0f0" }}>
        <Typography.Text
          strong
          style={{ display: "block", marginBottom: "8px" }}
        >
          Thứ tự sắp xếp:
        </Typography.Text>
        <Radio.Group
          onChange={(e) => {
            if (selectedSortField) {
              setSort([`${selectedSortField} ${e.target.value}`]);
            }
          }}
          value={sort?.[0]?.split(" ")[1]}
          disabled={!selectedSortField}
        >
          <Space direction="vertical" size="middle">
            <Radio value="asc" style={{ fontSize: "14px" }}>
              <span style={{ color: "#595959" }}>Tăng dần</span>
            </Radio>
            <Radio value="desc" style={{ fontSize: "14px" }}>
              <span style={{ color: "#595959" }}>Giảm dần</span>
            </Radio>
          </Space>
        </Radio.Group>
      </div>
    </div>
  );

  const sharedProps: SharedTableProps = {
    items,
    loading,
    columns,
  };

  const { isMobile } = useBreakpoints();

  const renderTable = () => {
    if (isMobile) {
      return <MobileTable {...sharedProps} />;
    }
    return <DesktopTable {...sharedProps} />;
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {title && <Typography.Title level={4}>{title}</Typography.Title>}
      <Space wrap>
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

      {renderTable()}

      <Flex justify="flex-end">
        <Pagination
          {...pagination}
          showTotal={(total) => `Tổng số ${total} bản ghi`}
          showSizeChanger={true}
          showQuickJumper={false}
          onChange={(page, pageSize) =>
            handleTableChange(
              { ...pagination, pageSize, current: page },
              null,
              null
            )
          }
        />
      </Flex>
    </Space>
  );
};

const DataSourceListTable = withDataSource(
  ListTable as React.ComponentType<WithDataSourceChildProps>
);

export default DataSourceListTable;
