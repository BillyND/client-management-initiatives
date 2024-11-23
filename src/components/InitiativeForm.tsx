import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const { TextArea } = Input;

interface FormData {
  title: string;
  description: string;
  problem: string;
  goal: string;
  method: string;
  expectedResult: string;
}

const InitiativeForm: React.FC = () => {
  const { control, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Controller
        name="title"
        control={control}
        rules={{ required: "Vui lòng nhập tên sáng kiến" }}
        render={({ field, fieldState: { error } }) => (
          <Form.Item
            label="Tên sáng kiến"
            validateStatus={error ? "error" : ""}
            help={error?.message}
          >
            <Input {...field} />
          </Form.Item>
        )}
      />
      <Controller
        name="description"
        control={control}
        rules={{ required: "Vui lòng nhập mô tả sáng kiến" }}
        render={({ field, fieldState: { error } }) => (
          <Form.Item
            label="Mô tả sáng kiến"
            validateStatus={error ? "error" : ""}
            help={error?.message}
          >
            <TextArea {...field} rows={4} />
          </Form.Item>
        )}
      />
      <Controller
        name="problem"
        control={control}
        rules={{ required: "Vui lòng nhập vấn đề cần giải quyết" }}
        render={({ field, fieldState: { error } }) => (
          <Form.Item
            label="Vấn đề cần giải quyết"
            validateStatus={error ? "error" : ""}
            help={error?.message}
          >
            <TextArea {...field} rows={4} />
          </Form.Item>
        )}
      />
      <Controller
        name="goal"
        control={control}
        rules={{ required: "Vui lòng nhập mục tiêu" }}
        render={({ field, fieldState: { error } }) => (
          <Form.Item
            label="Mục tiêu"
            validateStatus={error ? "error" : ""}
            help={error?.message}
          >
            <Input {...field} />
          </Form.Item>
        )}
      />
      <Controller
        name="method"
        control={control}
        rules={{ required: "Vui lòng nhập phương pháp thực hiện" }}
        render={({ field, fieldState: { error } }) => (
          <Form.Item
            label="Phương pháp thực hiện"
            validateStatus={error ? "error" : ""}
            help={error?.message}
          >
            <TextArea {...field} rows={4} />
          </Form.Item>
        )}
      />
      <Controller
        name="expectedResult"
        control={control}
        rules={{ required: "Vui lòng nhập kết quả dự kiến" }}
        render={({ field, fieldState: { error } }) => (
          <Form.Item
            label="Kết quả dự kiến"
            validateStatus={error ? "error" : ""}
            help={error?.message}
          >
            <TextArea {...field} rows={4} />
          </Form.Item>
        )}
      />
      <Form.Item label="Tài liệu kèm theo">
        <Upload>
          <Button icon={<UploadOutlined />}>Tải lên tài liệu</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Gửi sáng kiến
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InitiativeForm;
