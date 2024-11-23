import React from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useForm, Controller } from "react-hook-form";

const { Option } = Select;

const RegisterPage: React.FC = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    // Implement user registration logic
    console.log("Đăng ký người dùng:", data);
    message.success("Đăng ký thành công!");
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Form.Item label="Họ tên">
            <Input {...field} />
          </Form.Item>
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Form.Item label="Email">
            <Input {...field} type="email" />
          </Form.Item>
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Form.Item label="Mật khẩu">
            <Input.Password {...field} />
          </Form.Item>
        )}
      />
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <Form.Item label="Vai trò">
            <Select {...field}>
              <Option value="teacher">Giáo viên</Option>
              <Option value="manager">Cán bộ quản lý</Option>
              <Option value="student">Học sinh</Option>
            </Select>
          </Form.Item>
        )}
      />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPage;
