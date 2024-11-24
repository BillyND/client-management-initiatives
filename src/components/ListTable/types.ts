import { WithDataSourceChildProps } from "../../hoc/withDataSource";

export const VIEW_ACTIONS = {
  CREATE: "createView",
  DELETE: "deleteView",
  RENAME: "renameView",
  UPDATE: "updateView",
  DUPLICATE: "duplicateView",
} as const;

export interface ListTableView {
  name: string;
  filters: {
    queryValue: string;
    [key: string]: any;
  };
}

export interface ListTableFilter {
  key: string;
  label: string;
  component: React.ComponentType<any>;
  props?: any;
}

export interface ListTableData {
  items?: any[];
  selectedRowKeys?: string[];
  filterValues?: any;
  total?: number;
  current?: number;
  pageSize?: number;
  queryKey?: string;
}

export interface ViewOperation {
  key: string;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}

export interface ListTableProps extends WithDataSourceChildProps {
  columns: any[];
  limit?: number;
  views?: ListTableView[];
  filters?: ListTableFilter[];
  selectable?: boolean;
  loading: boolean;
  emptyState?: React.ReactNode;
  showFilter?: boolean;
  showPagination?: boolean;
  rowSelection?: any;
  onRow?: (record: any) => any;
  resourceName?: {
    singular: string;
    plural: string;
  };
  onlyLocalData?: boolean;
  setListTableData?: (data: ListTableData) => void;
}

export interface ListTableState {
  error?: Error;
  activeTab: string;
  views: ListTableView[];
  selectedRowKeys: string[];
  searchText: string;
  activeFilters: { [key: string]: any };
  isModalVisible: boolean;
  modalType: "create" | "rename" | null;
  modalValue: string;
  loading: boolean;
}
