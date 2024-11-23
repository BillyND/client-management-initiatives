import { Button, Form, Input, InputNumber, Select } from "antd";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import useStore from "../store/useStore";

const { Option } = Select;
const { TextArea } = Input;

const EvaluationPage: React.FC = () => {
  const { control, handleSubmit } = useForm();
  const initiatives = useStore((state) => state.initiatives);
  const updateInitiative = useStore((state) => state.updateInitiative);

  const onSubmit = (data: {
    initiativeId: string;
    scores: {
      creativity: number;
      feasibility: number;
      effectiveness: number;
      scalability: number;
    };
    comment: string;
  }) => {
    const totalScore = Object.values(data.scores).reduce(
      (a: number, b: number) => a + b,
      0
    );
    updateInitiative(data.initiativeId, {
      scores: data.scores,
      totalScore,
      status: totalScore >= 70 ? "Đang triển khai" : "Bị từ chối",
    });
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit((data) => onSubmit(data as any))}
    >
      <Controller
        name="initiativeId"
        control={control}
        render={({ field }) => (
          <Form.Item label="Chọn sáng kiến">
            <Select {...field}>
              {initiatives.map((initiative) => (
                <Option key={initiative.id} value={initiative.id}>
                  {initiative.initiativeName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      />
      <Controller
        name="scores.creativity"
        control={control}
        render={({ field }) => (
          <Form.Item label="Tính sáng tạo (20 điểm)">
            <InputNumber {...field} min={0} max={20} />
          </Form.Item>
        )}
      />
      <Controller
        name="scores.feasibility"
        control={control}
        render={({ field }) => (
          <Form.Item label="Tính khả thi (30 điểm)">
            <InputNumber {...field} min={0} max={30} />
          </Form.Item>
        )}
      />
      <Controller
        name="scores.effectiveness"
        control={control}
        render={({ field }) => (
          <Form.Item label="Hiệu quả dự kiến (30 điểm)">
            <InputNumber {...field} min={0} max={30} />
          </Form.Item>
        )}
      />
      <Controller
        name="scores.scalability"
        control={control}
        render={({ field }) => (
          <Form.Item label="Khả năng nhân rộng (20 điểm)">
            <InputNumber {...field} min={0} max={20} />
          </Form.Item>
        )}
      />
      <Controller
        name="comment"
        control={control}
        render={({ field }) => (
          <Form.Item label="Nhận xét">
            <TextArea {...field} rows={4} />
          </Form.Item>
        )}
      />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Gửi đánh giá
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EvaluationPage;
