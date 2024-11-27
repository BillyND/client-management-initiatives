import {
  AuditOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  FolderOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { MenuItem } from "../layouts/fns";
import i18n from "../i18n/config";

export enum ROLES {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  USER = "user",
  MANAGER = "manager",
  EVALUATOR = "evaluator",
  SECRETARY = "secretary",
}

export const DEFAULT_ROLE = ROLES.USER;

// Menu item interface for better type checking
interface RouteItem {
  key: string;
  label: JSX.Element;
  icon: JSX.Element;
}

// Function to translate text
const t = i18n.t;

// Define route groups with proper typing
const ROUTE_GROUPS: Record<string, RouteItem[]> = {
  INITIATIVE_MANAGEMENT: [
    {
      key: "/initiatives",
      label: <Link to="/initiatives">{t("manage-initiatives")}</Link>,
      icon: <FolderOutlined />,
    },
  ],
  USER_MANAGEMENT: [
    {
      key: "/users",
      label: <Link to="/users">{t("manage-users")}</Link>,
      icon: <UserOutlined />,
    },
  ],
  REPORTS: [
    {
      key: "/reports",
      label: <Link to="/reports">{t("statistical-reports")}</Link>,
      icon: <BarChartOutlined />,
    },
  ],
  EVALUATION: [
    {
      key: "/evaluate",
      label: <Link to="/evaluate">{t("evaluate-initiatives")}</Link>,
      icon: <CheckCircleOutlined />,
    },
  ],
  REVIEW: [
    {
      key: "/review",
      label: <Link to="/review">{t("check-records")}</Link>,
      icon: <AuditOutlined />,
    },
  ],
  USER_INITIATIVES: [
    {
      key: "/my-initiatives",
      label: <Link to="/my-initiatives">{t("my-initiatives")}</Link>,
      icon: <FileSearchOutlined />,
    },
    {
      key: "/submit-initiative",
      label: <Link to="/submit-initiative">{t("submit-initiative")}</Link>,
      icon: <FileAddOutlined />,
    },
  ],
} as const;

// Role-based menu items mapping with proper typing
export const ROLE_MENU_ITEMS: Record<ROLES, MenuItem[]> = {
  [ROLES.SUPER_ADMIN]: [
    ...ROUTE_GROUPS.INITIATIVE_MANAGEMENT,
    ...ROUTE_GROUPS.USER_MANAGEMENT,
    ...ROUTE_GROUPS.REPORTS,
    ...ROUTE_GROUPS.EVALUATION,
    ...ROUTE_GROUPS.REVIEW,
    ...ROUTE_GROUPS.USER_INITIATIVES,
  ],
  [ROLES.ADMIN]: [
    ...ROUTE_GROUPS.INITIATIVE_MANAGEMENT,
    ...ROUTE_GROUPS.USER_MANAGEMENT,
    ...ROUTE_GROUPS.REPORTS,
  ],
  [ROLES.USER]: [...ROUTE_GROUPS.USER_INITIATIVES],
  [ROLES.EVALUATOR]: [...ROUTE_GROUPS.EVALUATION],
  [ROLES.MANAGER]: [...ROUTE_GROUPS.REPORTS],
  [ROLES.SECRETARY]: [...ROUTE_GROUPS.REVIEW],
};
