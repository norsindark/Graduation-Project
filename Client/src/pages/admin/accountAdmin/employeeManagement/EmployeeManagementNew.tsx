import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification } from 'antd';
import {
  callAddNewEmployee,
  callGetAllEmployers,
} from '../../../../services/serverApi';
import { UserAddOutlined, CloseOutlined } from '@ant-design/icons';
import { Select } from 'antd';

interface EmployeeNewProps {
  onAddSuccess: () => void;
  setShowEmployeeNew: (show: boolean) => void;
}

const EmployeeManagementNew: React.FC<EmployeeNewProps> = ({
  onAddSuccess,
  setShowEmployeeNew,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employers, setEmployers] = useState<
    { email: string; fullName: string }[]
  >([]);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const responseAllEmployers = await callGetAllEmployers();

        if (responseAllEmployers?.status === 200) {
          setEmployers(responseAllEmployers.data);
        }
      } catch (error) {
        console.error('Error fetching employers:', error);
      }
    };

    fetchEmployers();
  }, []);

  const onFinish = async (values: any) => {
    const { emails, salary, jobTitle } = values;
    console.log('values', values);
    setIsSubmitting(true);
    try {
      const response = await callAddNewEmployee(emails, salary, jobTitle);
      if (response?.status === 200) {
        notification.success({
          message: 'Employee added successfully!',
          duration: 5,
          showProgress: true,
        });
        onAddSuccess();
      } else {
        notification.error({
          message: 'Failed to add employee',
          description: response.data.errors?.error || 'An error occurred!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error adding employee',
        description: 'An error occurred while adding the employee!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h4 className="text-center p-3 font-[500] text-[18px]">
        Add New Employee
      </h4>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Select Emails"
          className="font-medium"
          name="emails"
          rules={[
            { required: true, message: 'Please select at least one employee!' },
          ]}
        >
          <Select mode="multiple" placeholder="Select emails">
            {employers.map((employer) => (
              <Select.Option key={employer.email} value={employer.email}>
                {employer.fullName} ({employer.email})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="salary"
          label="Salary"
          className="font-medium"
          rules={[
            { required: true, message: 'Please enter salary!' },
            {
              validator: (_, value) => {
                if (value === undefined || value === null || value === '') {
                  return Promise.reject('Salary is required!');
                }
                if (isNaN(value)) {
                  return Promise.reject('Salary must be a number!');
                }
                if (value < 0) {
                  return Promise.reject('Salary cannot be negative!');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Enter salary" />
        </Form.Item>
        <Form.Item
          name="jobTitle"
          label="Job Title"
          className="font-medium"
          rules={[{ required: true, message: 'Please enter job title!' }]}
        >
          <Input placeholder="Enter job title" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            loading={isSubmitting}
            icon={<UserAddOutlined />}
          >
            Save
          </Button>
          <Button
            type="primary"
            shape="round"
            danger
            onClick={() => setShowEmployeeNew(false)}
            style={{ marginLeft: 10 }}
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EmployeeManagementNew;
