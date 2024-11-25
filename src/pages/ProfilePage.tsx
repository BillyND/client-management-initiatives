import { Card, Descriptions, Typography } from "antd";
import { useAuthStore } from "../store/useAuthStore";

const { Title } = Typography;

import { Button, Form, Input, Modal, message } from "antd";
import { useState } from "react";
import { userService } from "../services/userService";

interface EditProfileFormData {
  name: string;
  phone: string;
  department: string;
  position: string;
}

const phoneNumberValidator = (_: any, value: string) => {
  if (!value) {
    return Promise.resolve();
  }

  const phoneRegex = /^\d+$/;
  if (!phoneRegex.test(value)) {
    return Promise.reject("Số điện thoại chỉ được chứa chữ số");
  }

  if (value.length > 20) {
    return Promise.reject("Số điện thoại không được vượt quá 20 số");
  }

  return Promise.resolve();
};

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore((state) => state);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm<EditProfileFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = () => {
    form.setFieldsValue({
      name: user?.name || "",
      phone: user?.phone || "",
      department: user?.department || "",
      position: user?.position || "",
    });
    setIsEditing(true);
  };

  const handleSubmit = async (values: EditProfileFormData) => {
    try {
      setIsSubmitting(true);
      const user = await userService.updateProfile(values);
      setAuth(user);
      setIsEditing(false);
      message.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={2}>Thông tin cá nhân</Title>
        <Button type="primary" onClick={handleEdit}>
          Chỉnh sửa
        </Button>
      </div>

      <Card>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Họ và tên">
            {user?.name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {user?.email || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {user?.phone || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Đơn vị">
            {user?.department || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Chức vụ">
            {user?.position || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal
        title="Chỉnh sửa thông tin"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ validator: phoneNumberValidator }]}
          >
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item name="department" label="Đơn vị">
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Chức vụ">
            <Input />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button
              onClick={() => setIsEditing(false)}
              style={{ marginRight: 8 }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
