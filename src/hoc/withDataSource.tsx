import { message } from "antd";
import { useCallback, useEffect, useState } from "react";
import type { TablePaginationConfig } from "antd/es/table";
import { useAuthStore } from "../store/useAuthStore";
import apiClient from "../utils/apiClient";

export interface WithDataSourceProps {
  sort?: string[];
  queryKey: string;
  dataSource?: string;
  onlyLocalData?: boolean;
  [key: string]: any;
}

export interface WithDataSourceChildProps {
  page: number;
  items: any[];
  total: number;
  loading: boolean;
  queryKey: string;
  firstLoad: boolean;
  sort?: string[];
  filterValues: {
    queryValue?: string;
    [key: string]: any;
  };
  pagination: TablePaginationConfig;
  setPagination: (config: TablePaginationConfig) => void;
  setSort: (sort: string[]) => void;
  setFilterValues: (values: { [key: string]: any }) => void;
}

const timers: { [key: string]: any } = {};
const aborters: { [key: string]: AbortController } = {};

export default function withDataSource(
  Component: React.ComponentType<WithDataSourceChildProps>
) {
  return function WithDataSource(props: WithDataSourceProps) {
    const {
      queryKey,
      sort: _sort,
      dataSource = "",
      onlyLocalData = false,
      ...otherProps
    } = props;

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);
    const [sort, setSort] = useState<string[]>(_sort ? [_sort[0]] : []);
    const [filterValues, setFilterValues] = useState<{ [key: string]: any }>(
      {}
    );
    const [pagination, setPagination] = useState<TablePaginationConfig>({
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      showTotal: (total) => `Tổng số ${total} mục`,
    });

    const fetchData = useCallback(async () => {
      setLoading(true);

      if (onlyLocalData) {
        // Xử lý dữ liệu local
        const { queryValue, ...otherFilters } = filterValues;
        let filteredItems = otherProps.items || [];

        // Áp dụng filter tìm kiếm
        if (queryValue) {
          filteredItems = filteredItems.filter((item: any) =>
            item[queryKey]
              ?.toString()
              .toLowerCase()
              .includes(queryValue.toLowerCase())
          );
        }

        // Áp dụng các filter khác
        Object.entries(otherFilters).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length) {
            filteredItems = filteredItems.filter((item: any) =>
              value.includes(item[key])
            );
          } else if (typeof value === "string" && value) {
            filteredItems = filteredItems.filter((item: any) =>
              item[key]?.toString().toLowerCase().includes(value.toLowerCase())
            );
          }
        });

        // Sắp xếp
        if (sort?.[0]) {
          const [field, order] = sort[0].split(" ");
          filteredItems.sort((a: any, b: any) => {
            const aVal =
              field === "createdAt" ? new Date(a[field]).getTime() : a[field];
            const bVal =
              field === "createdAt" ? new Date(b[field]).getTime() : b[field];

            if (typeof aVal === "string") {
              return order === "ascend"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
            }
            return order === "ascend" ? aVal - bVal : bVal - aVal;
          });
        }

        // Phân trang
        const start = (pagination.current! - 1) * pagination.pageSize!;
        const paginatedItems = filteredItems.slice(
          start,
          start + pagination.pageSize!
        );

        setItems(paginatedItems);
        setPagination((prev) => ({ ...prev, total: filteredItems.length }));
        setLoading(false);
        setFirstLoad(false);
      } else {
        // Xử lý API call
        abortRequest(dataSource);

        timers[dataSource] = setTimeout(async () => {
          const { queryValue, ...otherFilters } = filterValues;

          // Tạo params
          const params = new URLSearchParams();
          params.append("page", pagination.current!.toString());
          params.append("limit", pagination.pageSize!.toString());

          if (queryValue) {
            params.append("q", queryValue);
          }

          if (sort?.length) {
            params.append("sort", sort[0]);
          }

          // Thêm các filter khác
          Object.entries(otherFilters).forEach(([key, value]) => {
            if (value) {
              params.append(
                key,
                Array.isArray(value) ? value.join(",") : value
              );
            }
          });

          try {
            aborters[dataSource] = new AbortController();
            const response = await apiClient.get(
              `${
                import.meta.env.VITE_API_URL
              }/${dataSource}?${params.toString()}`,
              {
                headers: {
                  Authorization: `Bearer ${
                    useAuthStore.getState().accessToken
                  }`,
                },
                signal: aborters[dataSource].signal,
              }
            );

            if (response.status !== 200) {
              throw new Error("Failed to fetch data");
            }

            const data = response.data;
            setItems(data.items);
            setPagination((prev) => ({ ...prev, total: data.total }));
            setFirstLoad(false);
          } catch (error: any) {
            if (error.name !== "AbortError") {
              message.error("Không thể tải dữ liệu");
              console.error("Error fetching data:", error);
            }
          } finally {
            setLoading(false);
          }
        }, 300);
      }
    }, [
      onlyLocalData,
      filterValues,
      otherProps.items,
      sort,
      pagination,
      queryKey,
      dataSource,
    ]);

    useEffect(() => {
      fetchData();
      return () => abortRequest(dataSource);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSource]);

    return (
      <Component
        {...otherProps}
        items={items}
        loading={loading}
        sort={sort}
        setSort={setSort}
        queryKey={queryKey}
        firstLoad={firstLoad}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        pagination={pagination}
        setPagination={setPagination}
        page={pagination.current || 1}
        total={pagination.total || 0}
      />
    );
  };
}

function abortRequest(dataSource: string) {
  if (aborters[dataSource]) {
    aborters[dataSource].abort();
    delete aborters[dataSource];
  }
  if (timers[dataSource]) {
    clearTimeout(timers[dataSource]);
    delete timers[dataSource];
  }
}
