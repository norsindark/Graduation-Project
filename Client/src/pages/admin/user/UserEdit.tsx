import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, notification, Row, Col } from 'antd';
import { callUpdateUser } from '../../../services/serverApi';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

interface UserItem {
  id: string;
  email: string;
  fullName: string;
  role: {
    id: string;
    name: string;
  };
  status: string;
}

interface UserEditProps {
  currentItem: UserItem;
  onEditSuccess: () => void;
  setShowUserEdit: (show: boolean) => void;
}

const UserEdit: React.FC<UserEditProps> = ({
  currentItem,
  onEditSuccess,
  setShowUserEdit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      ...currentItem,
      role: currentItem.role.name,
    });
  }, [currentItem, form]);

  const onFinish = async (values: any) => {
    const { email, role, status, fullName } = values;
    setLoading(true);
    try {
      const res = await callUpdateUser(
        email,
        role,
        status,
        fullName,
        currentItem.id
      );
      if (res?.status == 200) {
        notification.success({
          message: 'Update successful',
          description: 'User information has been updated.',
          duration: 5,
          showProgress: true,
        });
        onEditSuccess();
      } else {
        notification.error({
          message: 'Update failed',
          description: res.data.errors?.error || 'An error occurred!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Update failed',
        description: 'An error occurred!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="text-2xl font-medium text-center mb-4">Edit User</h4>
      <Form form={form} name="userEdit" onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter an email!' },
                { type: 'email', message: 'Invalid email format!' },
              ]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                { required: true, message: 'Please enter the full name!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select a role!' }]}
            >
              <Select>
                <Option value="USER">User</Option>
                <Option value="ADMIN">Admin</Option>
                <Option value="EMPLOYEE">Employee</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select a status!' }]}
            >
              <Select>
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">Inactive</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
          >
            Update
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => setShowUserEdit(false)}
            style={{ marginLeft: 8 }}
            shape="round"
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UserEdit;
