import { Button, Form, Input, message, Typography } from "antd";
import React from "react";
import { Initiative, initiativeService } from "../services";

const { Title } = Typography;
const { TextArea } = Input;

const SubmitInitiativePage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: Initiative) => {
    await initiativeService.create(values);
    message.success("Sáng kiến đã được gửi thành công!");
    // form.resetFields();
  };

  return (
    <div className="submit-initiative">
      <Title level={2}>Gửi sáng kiến</Title>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Title level={4}>Thông tin cá nhân</Title>
        <Form.Item name="unit" label="Đơn vị" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="position" label="Chức vụ" rules={[{ required: true }]}>
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
        <Form.Item
          name="attachment"
          label="Link tài liệu minh họa"
          rules={[
            {
              type: "url",
              message: "Vui lòng nhập đúng định dạng URL",
            },
          ]}
        >
          <Input placeholder="Nhập link tài liệu (vd: https://...)" />
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
