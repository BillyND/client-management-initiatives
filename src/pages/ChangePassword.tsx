import { LockOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, message, Row, Typography } from "antd";
import { useState } from "react";
import { authService } from "../services";

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      message.success("Đổi mật khẩu thành công");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle">
      <Col xs={23} sm={20} md={16} lg={12} xl={8}>
        <Typography.Title level={4}>Đổi mật khẩu</Typography.Title>
        <Form form={form} layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            dependencies={["currentPassword"]}
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("currentPassword") !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu mới không được giống mật khẩu hiện tại")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu mới"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default ChangePassword;
