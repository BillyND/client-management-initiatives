import { Grid, message, Modal, Spin } from "antd";
import Transfer, { TransferItem } from "antd/es/transfer";
import { Key, ReactNode, useEffect, useState } from "react";
import { roleService } from "../../services/roleService";
import { userService } from "../../services/userService";
import { useTranslation } from "react-i18next";

const { useBreakpoint } = Grid;

interface UserRoleModalProps {
  userEmail: string | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Role {
  _id: string;
  name: string;
  description?: string;
  key?: string;
}

interface TransferItemType extends TransferItem {
  _id: string;
  name: string;
  description?: string;
}

export const UserRoleModal: React.FC<UserRoleModalProps> = ({
  userEmail,
  visible,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [roles, setRoles] = useState<TransferItemType[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Key[]>([]);
  const { t } = useTranslation();
  const { xs } = useBreakpoint();

  // Constants for messages and titles
  const MESSAGES = {
    SUCCESS: t("role-updated-successfully"),
    FETCH_ERROR: t("unable-to-load-role-information"),
    UPDATE_ERROR: t("unable-to-update-role-please-try-again"),
    NO_ROLE_SELECTED: t("please-select-at-least-one-role"),
  } as const;

  const MODAL_CONFIG = {
    TITLE: t("assign-roles-to-user"),
    WIDTH: 800,
    TRANSFER_TITLES: [t("available-roles"), t("assigned-roles")] as const,
    LIST_STYLE: {
      width: `100%`,
      height: xs ? 300 : 400,
    },
    OK_TEXT: t("confirm"),
    CANCEL_TEXT: t("cancel"),
  } as const;

  const TRANSFER_LOCALE = {
    itemUnit: t("role"),
    itemsUnit: t("roles"),
    notFoundContent: t("no-data"),
    searchPlaceholder: t("search"),
  } as const;

  // Data fetching functions
  const fetchRolesData = async () => {
    try {
      const rolesResponse = await roleService.getRoles();
      if (!rolesResponse?.data) {
        throw new Error("Invalid roles response");
      }

      return rolesResponse.data.map((role: Role) => ({
        ...role,
        key: role.name || role._id, // Fallback to _id if name is missing
      }));
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchUserRoles = async (email: string) => {
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const userResponse = await userService.getUserByEmail(email);
      if (!userResponse?.roles) {
        return []; // Return empty array if no roles
      }

      return userResponse.roles.map((role: string) => role).filter(Boolean); // Filter out null/undefined
    } catch (error) {
      console.error("Error fetching user roles:", error);
    }
  };

  // Load data when modal opens
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!visible || !userEmail) return;

      try {
        setLoading(true);
        const [transformedRoles, userRoles] = await Promise.all([
          fetchRolesData(),
          fetchUserRoles(userEmail),
        ]);

        // Only update state if component is still mounted
        if (isMounted) {
          setRoles(transformedRoles || []); // Handle null/undefined
          setSelectedRoles(Array.isArray(userRoles) ? userRoles : []); // Ensure array
        }
      } catch (error: any) {
        const isNetworkError =
          error.name !== "AbortError" && error.name !== "CanceledError";

        if (isMounted) {
          setLoading(false);
        }

        if (isNetworkError) {
          console.error("Error fetching data:", error);
          message.error(MESSAGES.FETCH_ERROR);
          onClose();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [visible, userEmail, onClose, MESSAGES.FETCH_ERROR]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!userEmail) return;

    // Validate selected roles
    if (!selectedRoles || selectedRoles.length === 0) {
      message.warning(MESSAGES.NO_ROLE_SELECTED);
      return;
    }

    try {
      setLoading(true);

      // Validate roles data exists
      if (!roles || roles.length === 0) {
        throw new Error("Roles data is missing");
      }

      const roleIds = roles
        .filter((role) => {
          // Validate role object has required fields
          if (!role?.name || !role?._id) {
            throw new Error("Invalid role data structure");
          }
          return selectedRoles.includes(role.name);
        })
        .map((role) => role._id);

      // Validate we have role IDs to assign
      if (roleIds.length === 0) {
        throw new Error("No valid role IDs found");
      }

      await userService.assignRoleToUser(userEmail, roleIds);
      message.success(MESSAGES.SUCCESS);
      onSuccess();
      onClose();
    } catch (error: any) {
      const isNetworkError = error.name !== "CanceledError";

      console.error("Error updating user roles:", error);

      if (isNetworkError) {
        message.error(MESSAGES.UPDATE_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = (inputValue: string, item: TransferItemType) => {
    // Handle null/undefined input value
    if (!inputValue) {
      return true;
    }

    // Safely trim and convert input to lowercase
    const searchValue = inputValue.trim().toLowerCase();

    // If search value is empty after trim, show all items
    if (!searchValue) {
      return true;
    }

    // Safely check item name exists and do case-insensitive search
    const nameMatch = item.name
      ? item.name.toLowerCase().includes(searchValue)
      : false;

    // Safely check description exists and do case-insensitive search
    const descriptionMatch = item.description
      ? item.description.toLowerCase().includes(searchValue)
      : false;

    return nameMatch || descriptionMatch;
  };

  // Role item component
  const RoleItem: React.FC<TransferItemType> = ({ name, description }) => (
    <div>
      <div>{name}</div>
      {description && (
        <div style={{ fontSize: "12px", color: "#888" }}>{description}</div>
      )}
    </div>
  );

  // Add this new function to compute dynamic styles
  const getTransferListStyle = (direction: "left" | "right") => {
    const baseStyle = MODAL_CONFIG.LIST_STYLE;

    // Add red border for right panel when no roles selected
    if (direction === "right" && selectedRoles.length === 0 && !loading) {
      return {
        ...baseStyle,
        borderColor: "#ff4d4f",
        backgroundColor: "#fff2f0",
      };
    }

    return baseStyle;
  };

  return (
    <Modal
      title={MODAL_CONFIG.TITLE}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      width={MODAL_CONFIG.WIDTH}
      confirmLoading={loading}
      maskClosable={false}
      destroyOnClose
      okText={MODAL_CONFIG.OK_TEXT}
      cancelText={MODAL_CONFIG.CANCEL_TEXT}
      okButtonProps={{
        disabled: selectedRoles.length === 0,
        title: MESSAGES.NO_ROLE_SELECTED,
      }}
    >
      <Spin spinning={loading}>
        <Transfer<TransferItemType>
          dataSource={roles}
          titles={MODAL_CONFIG.TRANSFER_TITLES as unknown as ReactNode[]}
          targetKeys={selectedRoles}
          onChange={(targetKeys: Key[]) => setSelectedRoles(targetKeys)}
          render={(item: TransferItemType) => <RoleItem {...item} />}
          listStyle={({ direction }) => getTransferListStyle(direction)}
          showSearch
          filterOption={handleSearch}
          locale={TRANSFER_LOCALE}
          style={{ flexDirection: xs ? "column" : "row", gap: 4 }} // New line added
        />
      </Spin>
    </Modal>
  );
};

export default UserRoleModal;
