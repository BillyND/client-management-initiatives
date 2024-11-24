import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Tabs,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services";

const { Title } = Typography;
const { TabPane } = Tabs;

const AuthPage: React.FC = () => {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const onLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await authService.login(values.email, values.password);

      if (response.success) {
        message.success("Đăng nhập thành công!");

        // Redirect to home page after successful login
        navigate("/");
      } else {
        message.error(response.data.success);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      setLoading(true);
      await authService.register(values.email, values.password, values.name);
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      registerForm.resetFields();
      // Switch to login tab after successful registration
      setActiveTab("login");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
        paddingBottom: 24,
        background:
          "linear-gradient(135deg, #E6D5FF 0%, #FFE5F0 20%, #E8F4FA 40%, #E8FFE9 60%, #FFF5CC 80%, #FFE5E5 100%)",
      }}
    >
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Title
          level={2}
          type="secondary"
          style={{ textAlign: "center", marginBottom: 30 }}
        >
          Hệ thống quản lý và đánh giá sáng kiến
        </Title>

        <Card bordered={false}>
          <Tabs centered activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Đăng nhập" key="login">
              <Form
                form={loginForm}
                layout="vertical"
                onFinish={onLogin}
                size="large"
              >
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input placeholder="Nhập email của bạn" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="Đăng ký" key="register">
              <Form
                form={registerForm}
                layout="vertical"
                onFinish={onRegister}
                size="large"
              >
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input placeholder="Nhập email của bạn" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu xác nhận không khớp!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Xác nhận mật khẩu" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                  >
                    Đăng ký
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  );
};

export default AuthPage;
