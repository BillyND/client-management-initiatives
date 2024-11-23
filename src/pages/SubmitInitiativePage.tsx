import React from "react";
import { Typography, Form, Input, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useStore from "../store/useStore";

const { Title } = Typography;
const { TextArea } = Input;

const SubmitInitiativePage: React.FC = () => {
  const [form] = Form.useForm();
  const addInitiative = useStore((state) => state.addInitiative);

  const onFinish = (values: {
    name: string;
    unit: string;
    position: string;
    email: string;
    initiativeName: string;
    problem: string;
    goal: string;
    method: string;
    expectedResult: string;
  }) => {
    const id = Date.now().toString(); // Simple ID generation
    addInitiative({
      ...values,
      id,
      status: "pending",
    });
    message.success("Sáng kiến đã được gửi thành công!");
    form.resetFields();
  };

  const uploadProps = {
    name: "file",
    action: "/api/upload", // Replace with actual upload endpoint
    onChange(info: any) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} đã được tải lên thành công`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
  };

  return (
    <div className="submit-initiative">
      <Title level={2}>Gửi sáng kiến</Title>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Title level={4}>Thông tin cá nhân</Title>
        <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="unit" label="Đơn vị" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="position" label="Chức vụ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Title level={4}>Mô tả sáng kiến</Title>
        <Form.Item
          name="initiativeName"
          label="Tên sáng kiến"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="problem"
          label="Vấn đề cần giải quyết"
          rules={[{ required: true }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="goal" label="Mục tiêu" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="method"
          label="Phương pháp thực hiện"
          rules={[{ required: true }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="expectedResult"
          label="Kết quả dự kiến"
          rules={[{ required: true }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Title level={4}>Tài liệu kèm theo</Title>
        <Form.Item name="attachments" label="Tải lên tài liệu minh họa">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi sáng kiến
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SubmitInitiativePage;
