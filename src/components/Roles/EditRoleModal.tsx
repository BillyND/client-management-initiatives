import { Form, Input, Modal, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { roleService } from "../../services/roleService";

interface EditRoleModalProps {
  roleId: string | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface RoleFormData {
  name: string;
  description: string;
}

export const EditRoleModal: React.FC<EditRoleModalProps> = ({
  roleId,
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<RoleFormData>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const isEditing = !!roleId;

  useEffect(() => {
    const fetchRoleData = async () => {
      if (!visible || !roleId) return;

      try {
        setFetchLoading(true);
        const response = await roleService.getRole(roleId);
        form.setFieldsValue({
          name: response.data.name,
          description: response.data.description,
        });
      } catch (error) {
        console.error("Error fetching role:", error);
        message.error("Không thể tải thông tin vai trò");
        onClose();
      } finally {
        setFetchLoading(false);
      }
    };

    fetchRoleData();
  }, [visible, roleId, form, onClose]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (isEditing && roleId) {
        await roleService.updateRole(roleId, values);
      } else {
        await roleService.createRole(values);
      }

      message.success(`${isEditing ? "Cập nhật" : "Tạo"} vai trò thành công!`);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error submitting role:", error);
      message.error(
        `Không thể ${isEditing ? "cập nhật" : "tạo"} vai trò. Vui lòng thử lại!`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={`${isEditing ? "Chỉnh sửa" : "Thêm"} vai trò`}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
      confirmLoading={loading}
      maskClosable={false}
    >
      <Spin spinning={fetchLoading}>
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            name="name"
            label="Tên vai trò"
            rules={[
              { required: true, message: "Vui lòng nhập tên vai trò" },
              { max: 100, message: "Tên vai trò không được quá 100 ký tự" },
            ]}
          >
            <Input placeholder="Nhập tên vai trò" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ max: 500, message: "Mô tả không được quá 500 ký tự" }]}
          >
            <Input.TextArea
              placeholder="Nhập mô tả vai trò"
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
