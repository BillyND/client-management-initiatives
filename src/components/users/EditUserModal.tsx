import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  message,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { userService } from "../../services/userService";

interface EditUserModalProps {
  userEmail: string | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  userEmail,
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [originalEmail, setOriginalEmail] = useState<string>("");

  const fetchUserData = useCallback(async () => {
    if (!userEmail || !visible) {
      form.resetFields();
      setOriginalEmail("");
      return;
    }

    try {
      setLoading(true);
      const userData = await userService.getUserByEmail(userEmail);
      setOriginalEmail(userData.email);
      form.setFieldsValue(userData);
    } catch (error) {
      console.log(error);
      message.error("Không thể tải thông tin người dùng");
      onClose();
    } finally {
      setLoading(false);
    }
  }, [userEmail, visible, form, onClose]);

  useEffect(() => {
    fetchUserData();
  }, [userEmail, visible, form, onClose, fetchUserData]);

  const handleCancel = () => {
    form.resetFields();
    setOriginalEmail("");
    onClose();
  };

  const handleSubmit = async (values: any) => {
    if (!originalEmail) return;

    try {
      setSubmitting(true);
      await userService.updateUser(originalEmail, values);
      message.success("Cập nhật thông tin thành công");
      onSuccess?.();
      onClose();
    } catch (error) {
      let errorMessage = "Cập nhật thất bại";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <span>Chỉnh sửa thông tin người dùng</span>
          {loading && <LoadingOutlined />}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      maskClosable={false}
    >
      {loading ? (
        <Row justify="center" align="middle" style={{ minHeight: 200 }}>
          <Col>
            <Spin size="large" />
          </Col>
        </Row>
      ) : (
        <Card bordered={false}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            disabled={loading || submitting}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                    {
                      max: 254,
                      message: "Email không được vượt quá 254 ký tự",
                    },
                  ]}
                >
                  <Input disabled={true} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                    {
                      type: "string",
                      message: "Họ và tên phải là chuỗi ký tự",
                    },
                    { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự" },
                    {
                      max: 50,
                      message: "Họ và tên không được vượt quá 50 ký tự",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    {
                      type: "string",
                      message: "Số điện thoại phải là chuỗi ký tự",
                    },
                    {
                      pattern: /^[0-9+\-\s()]+$/,
                      message:
                        "Số điện thoại chỉ được chứa số và các ký tự +, -, (), khoảng trắng",
                    },
                    {
                      min: 10,
                      message: "Số điện thoại phải có ít nhất 10 ký tự",
                    },
                    {
                      max: 15,
                      message: "Số điện thoại không được vượt quá 15 ký tự",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="department"
                  label="Phòng ban"
                  rules={[
                    {
                      type: "string",
                      message: "Phòng ban phải là chuỗi ký tự",
                    },
                    {
                      max: 50,
                      message: "Phòng ban không được vượt quá 50 ký tự",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="position"
                  label="Chức vụ"
                  rules={[
                    { type: "string", message: "Chức vụ phải là chuỗi ký tự" },
                    {
                      max: 50,
                      message: "Chức vụ không được vượt quá 50 ký tự",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="isActive"
                  label="Trạng thái"
                  rules={[
                    {
                      type: "boolean",
                      message: "Trạng thái phải là giá trị boolean",
                    },
                  ]}
                >
                  <Select>
                    <Select.Option value={true}>Hoạt động</Select.Option>
                    <Select.Option value={false}>Không hoạt động</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Row justify="end">
                <Space>
                  <Button onClick={handleCancel} disabled={submitting}>
                    Hủy
                  </Button>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    Lưu thay đổi
                  </Button>
                </Space>
              </Row>
            </Form.Item>
          </Form>
        </Card>
      )}
    </Modal>
  );
};
