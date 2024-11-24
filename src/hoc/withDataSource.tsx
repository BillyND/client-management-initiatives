import { message } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";
import { ITEM_LIST_LIMITATION } from "../constants";
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
      abbreviated = false,
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
    });

    const page = pagination.current || 1;
    const limit = pagination.pageSize || 10;

    const fetchData = useCallback(async () => {
      setLoading(true);

      if (onlyLocalData) {
        // Handle local data filtering
        const { queryValue, ...otherFilters } = filterValues;
        let filteredItems = otherProps.items || [];

        // Apply query filter
        if (queryValue) {
          filteredItems = filteredItems.filter((item: any) =>
            item[queryKey]
              ?.toString()
              .toLowerCase()
              .includes(queryValue.toLowerCase())
          );
        }

        // Apply other filters
        for (const filterOnKey in otherFilters) {
          if (
            otherFilters[filterOnKey] instanceof Array &&
            otherFilters[filterOnKey]?.length
          ) {
            filteredItems = filteredItems.filter((item: any) =>
              otherFilters[filterOnKey].includes(item[filterOnKey])
            );
          } else if (
            typeof otherFilters[filterOnKey] === "string" &&
            otherFilters[filterOnKey]
          ) {
            filteredItems = filteredItems.filter((item: any) =>
              item[filterOnKey]
                ?.toString()
                .toLowerCase()
                .includes(otherFilters[filterOnKey].toLowerCase())
            );
          }
        }

        // Sort
        if (sort?.[0]) {
          const [field, order] = sort[0].split(" ");
          filteredItems.sort((a: any, b: any) => {
            const aVal =
              field === "createdAt" ? new Date(a[field]).getTime() : a[field];
            const bVal =
              field === "createdAt" ? new Date(b[field]).getTime() : b[field];

            if (typeof aVal === "string") {
              return order === "asc"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
            }
            return order === "asc" ? aVal - bVal : bVal - aVal;
          });
        }

        // Sort items
        if (sort?.[0]) {
          const [key, order] = sort[0].split(" ");
          const isAsc = order === "asc";

          filteredItems = filteredItems.sort((a: any, b: any) => {
            const aValue =
              key === "createdAt" ? new Date(a[key]).getTime() : a[key];
            const bValue =
              key === "createdAt" ? new Date(b[key]).getTime() : b[key];

            // Prevent bug: Ensure values are comparable
            if (aValue === undefined || bValue === undefined) {
              return 0;
            }

            if (typeof aValue === "string" && typeof bValue === "string") {
              return isAsc
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }

            return isAsc ? aValue - bValue : bValue - aValue;
          });
        }

        // Paginate items
        const startIndex = (page - 1) * limit;
        const paginatedItems = filteredItems.slice(
          startIndex,
          startIndex + limit
        );

        setItems(paginatedItems);
        setPagination((prev) => ({ ...prev, total: filteredItems.length }));
        setLoading(false);
        setFirstLoad(false);
      } else {
        // Clear previous timer if exists
        if (timers[dataSource]) {
          clearTimeout(timers[dataSource]);
          delete timers[dataSource];
        }

        timers[dataSource] = setTimeout(async () => {
          const { queryValue, ...otherFilters } = filterValues;

          // Generate search params
          const searchParams = [`limit=${limit || ITEM_LIST_LIMITATION}`];

          if (abbreviated) {
            searchParams.push(`abbreviated=${abbreviated}`);
          }

          if (page > 1) {
            searchParams.push(`page=${page}`);
          }

          if (sort?.length) {
            searchParams.push(`sort=${sort[0].toString().replace(" ", "|")}`);
          }

          if (queryValue) {
            searchParams.push(
              `filter=${queryKey}|${encodeURIComponent(queryValue?.trim())}`
            );
          }

          for (const filterOnKey in otherFilters) {
            if (
              otherFilters[filterOnKey] instanceof Array &&
              otherFilters[filterOnKey]?.length
            ) {
              searchParams.push(
                `filter=${filterOnKey}|${otherFilters[filterOnKey].join(",")}`
              );
            } else if (
              typeof otherFilters[filterOnKey] === "string" &&
              otherFilters[filterOnKey]
            ) {
              searchParams.push(
                `filter=${filterOnKey}|${otherFilters[filterOnKey]}`
              );
            }
          }

          try {
            // Request data
            const queryString = searchParams.join("&");
            aborters[dataSource] = new AbortController();
            const queryDelimiter = dataSource.includes("?") ? "&" : "?";

            const res = await apiClient.get(
              `${dataSource}${
                queryString ? `${queryDelimiter}${queryString}` : ""
              }`,
              {
                signal: aborters[dataSource].signal,
              }
            );

            if (res.status !== 200) {
              throw new Error("Failed to fetch data");
            }

            const data = res.data;
            setItems(data.items);
            setPagination((prev) => ({ ...prev, total: data.total }));
            setFirstLoad(false);
          } catch (error: any) {
            const isNetworkError =
              error.name !== "AbortError" && error.name !== "CanceledError";

            if (isNetworkError) {
              console.error("[Data Fetch Error]:", error);
              message.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
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
      page,
      limit,
      queryKey,
      dataSource,
      abbreviated,
    ]);

    useEffect(() => {
      fetchData();
    }, [dataSource, fetchData]);

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
