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
import React from "react";

const { Title } = Typography;
const { TabPane } = Tabs;

const AuthPage: React.FC = () => {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const onLogin = (values: any) => {
    // Implement user login logic
    console.log("Đăng nhập người dùng:", values);
    message.success("Đăng nhập thành công!");
  };

  const onRegister = (values: any) => {
    // Implement user registration logic
    console.log("Đăng ký người dùng:", values);
    message.success("Đăng ký thành công!");
    loginForm.resetFields();
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: "100%", backgroundColor: "#f0f2f5" }}
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
          <Tabs centered>
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
                  <Button type="primary" htmlType="submit" block>
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
                  <Button type="primary" htmlType="submit" block>
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
