import React, { useState } from 'react';
import { Form, Input, Button, Select, notification, Row, Col } from 'antd';
import { callAddUser } from '../../../services/serverApi';
import { UserAddOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

interface UserNewProps {
  onAddSuccess: () => void;
  setShowOfferNew: (show: boolean) => void;
}

const ProductOfferDailyNew: React.FC<UserNewProps> = ({
  onAddSuccess,
  setShowOfferNew,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    const { email, password, fullName, role } = values;
    setLoading(true);
    try {
      const res = await callAddUser(email, password, fullName, role);
      if (res?.status == 200) {
        notification.success({
          message: 'User added successfully',
          description: 'The new user has been added to the system.',
          duration: 5,
          showProgress: true,
        });
        form.resetFields();
        onAddSuccess();
      } else {
        notification.error({
          message: 'Error adding user',
          description: res.data.errors?.error || 'An error occurred!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Error adding user',
        description:
          'An error occurred while adding the new user. Please try again.',
        duration: 5,
        showProgress: true,
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
            onClick={() => setShowOfferNew(false)}
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

export default ProductOfferDailyNew;
