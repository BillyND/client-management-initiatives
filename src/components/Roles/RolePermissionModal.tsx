import { Modal, Tree, message, Spin } from "antd";
import { useEffect, useState } from "react";
import type { DataNode } from "antd/es/tree";
import { roleService } from "../../services/roleService";

interface RolePermissionModalProps {
  roleId: string | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Permission {
  id: string;
  name: string;
  code: string;
  children?: Permission[];
}

export const RolePermissionModal: React.FC<RolePermissionModalProps> = ({
  roleId,
  visible,
  onClose,
  onSuccess,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissionsTree, setPermissionsTree] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!visible) return;

      try {
        setFetchLoading(true);

        // Fetch permissions tree
        const permissionsResponse = await roleService.getAllPermissions();
        setPermissionsTree(permissionsResponse.data);

        // Fetch role's permissions if editing
        if (roleId) {
          const rolePermissionsResponse = await roleService.getRolePermissions(
            roleId
          );
          setSelectedPermissions(
            rolePermissionsResponse.data.map((p: Permission) => p.code)
          );
        }
      } catch (error: any) {
        const isNetworkError =
          error.name !== "AbortError" && error.name !== "CanceledError";

        if (isNetworkError) {
          console.error("Error fetching data:", error);
          message.error("Không thể tải thông tin phân quyền");
          onClose();
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [visible, roleId, onClose]);

  const transformPermissionsToTree = (
    permissions: Permission[]
  ): DataNode[] => {
    return permissions.map((perm) => ({
      title: perm.name,
      key: perm.code,
      children: perm.children
        ? transformPermissionsToTree(perm.children)
        : undefined,
    }));
  };

  const handleSubmit = async () => {
    if (!roleId) return;

    try {
      setLoading(true);
      await roleService.updateRolePermissions(roleId, selectedPermissions);
      message.success("Cập nhật phân quyền thành công!");
      onSuccess();
      onClose();
    } catch (error: any) {
      const isNetworkError =
        error.name !== "AbortError" && error.name !== "CanceledError";

      if (isNetworkError) {
        console.error("Error updating permissions:", error);
        message.error("Không thể cập nhật phân quyền. Vui lòng thử lại!");
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = (checkedKeys: string[]) => {
    setSelectedPermissions(checkedKeys);
  };

  return (
    <Modal
      title="Phân quyền cho vai trò"
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      width={600}
      confirmLoading={loading}
      maskClosable={false}
    >
      <Spin spinning={fetchLoading}>
        {permissionsTree.length > 0 && (
          <Tree
            checkable
            checkedKeys={selectedPermissions}
            onCheck={(checked) => handleCheck(checked as string[])}
            treeData={transformPermissionsToTree(permissionsTree)}
            defaultExpandAll
          />
        )}
      </Spin>
    </Modal>
  );
};
