import React, { useState } from 'react';
import { Form, Input, Button, Select, notification, Row, Col } from 'antd';
import { callAddUser } from '../../../services/serverApi';
import { UserAddOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

interface UserNewProps {
  onAddSuccess: () => void;
  setShowUserNew: (show: boolean) => void;
}

const UserNew: React.FC<UserNewProps> = ({ onAddSuccess, setShowUserNew }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { email, password, fullName, role } = values;
      await callAddUser(email, password, fullName, role);
      notification.success({
        message: 'User added successfully',
        description: 'The new user has been added to the system.',
      });
      form.resetFields();
      onAddSuccess();
    } catch (error) {
      console.error('Error adding user:', error);
      notification.error({
        message: 'Error adding user',
        description:
          'An error occurred while adding the new user. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="text-2xl font-medium text-center mb-4">Create New User</h4>
      <Form
        form={form}
        name="userNew"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ role: 'USER' }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label="Email"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter an email!' },
                { type: 'email', message: 'Invalid email format!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="password"
              label="Password"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter a password!' },
                {
                  min: 6,
                  message: 'Password must be at least 6 characters long!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="fullName"
              label="Full Name"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter the full name!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="role"
              label="Role"
              className="font-medium"
              rules={[{ required: true, message: 'Please select a role!' }]}
            >
              <Select>
                <Option value="USER">User</Option>
                <Option value="ADMIN">Admin</Option>
                <Option value="EMPLOYEE">Employee</Option>
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
            icon={<UserAddOutlined />}
          >
            Save
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => setShowUserNew(false)}
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

export default UserNew;
