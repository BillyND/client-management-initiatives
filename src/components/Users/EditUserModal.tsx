import {
  Button,
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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
      console.error(error);
      message.error(t("unable-to-load-user-information"));
      onClose();
    } finally {
      setLoading(false);
    }
  }, [userEmail, visible, form, onClose, t]);

  useEffect(() => {
    fetchUserData();
  }, [userEmail, visible, fetchUserData]);

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
      message.success(t("user-information-updated-successfully"));
      onSuccess?.();
      onClose();
    } catch (error) {
      let errorMessage = t("update-failed");
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
      title={t("edit-user-information")}
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
                label={t("email")}
                rules={[
                  { required: true, message: t("please-enter-an-email") },
                  { type: "email", message: t("invalid-email-format") },
                  {
                    max: 254,
                    message: t("email-must-not-exceed-254-characters"),
                  },
                ]}
              >
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label={t("full-name")}
                rules={[
                  { required: true, message: t("please-enter-a-name") },
                  {
                    type: "string",
                    message: t("name-must-be-a-string"),
                  },
                  {
                    min: 2,
                    message: t("name-must-have-at-least-2-characters"),
                  },
                  {
                    max: 50,
                    message: t("name-must-not-exceed-50-characters"),
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
                label={t("phone-number")}
                rules={[
                  {
                    pattern: /^[0-9+\-\s()]+$/,
                    message: t(
                      "phone-number-can-only-contain-numbers-and-the-characters-spaces"
                    ),
                  },
                  {
                    min: 10,
                    message: t("phone-number-must-have-at-least-10-characters"),
                  },
                  {
                    max: 15,
                    message: t("phone-number-must-not-exceed-15-characters"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label={t("department")}
                rules={[
                  {
                    type: "string",
                    message: t("department-must-be-a-string"),
                  },
                  {
                    max: 50,
                    message: t("department-must-not-exceed-50-characters"),
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
                label={t("position")}
                rules={[
                  { type: "string", message: t("position-must-be-a-string") },
                  {
                    max: 50,
                    message: t("position-must-not-exceed-50-characters"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label={t("status")}
                rules={[
                  {
                    type: "boolean",
                    message: t("status-must-be-a-boolean-value"),
                  },
                ]}
              >
                <Select>
                  <Select.Option value={true}>{t("active")}</Select.Option>
                  <Select.Option value={false}>{t("inactive")}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Row justify="end">
              <Space>
                <Button onClick={handleCancel} disabled={submitting}>
                  {t("cancel")}
                </Button>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  {t("save-changes")}
                </Button>
              </Space>
            </Row>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
