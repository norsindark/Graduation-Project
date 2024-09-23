import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { callUpdateEmployee } from '../../../../services/serverApi';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
interface EmployeeEditProps {
  currentEmployee: {
    employeeId: string;
    employeeName: string;
    email: string;
    jobTitle: string;
    salary: string;
  };
  onEditSuccess: () => void;
  setShowEmployeeEdit: (show: boolean) => void;
}

const EmployeeManagementEdit: React.FC<EmployeeEditProps> = ({
  currentEmployee,
  onEditSuccess,
  setShowEmployeeEdit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    const { employeeName, salary, jobTitle } = values;
    console.log(values, 'values');

    setLoading(true);
    try {
      const response = await callUpdateEmployee(
        currentEmployee.employeeId,
        employeeName,
        salary,
        jobTitle
      );
      if (response?.status === 200) {
        notification.success({
          message: 'Employee updated successfully!',
          duration: 5,
          showProgress: true,
        });
        onEditSuccess();
      } else {
        notification.error({
          message: 'Failed to update employee',
          description: response.data.errors?.error || 'An error occurred!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error updating employee',
        description: 'An error occurred during the update process!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h4 className="text-center p-3 font-[500] text-[18px]">
        Edit Employee Information
      </h4>
      <Form
        form={form}
        layout="vertical"
        initialValues={currentEmployee}
        onFinish={onFinish}
      >
        <Form.Item
          name="employeeName"
          label="Employee Name"
          className="font-medium"
          rules={[{ required: true, message: 'Please enter employee name!' }]}
        >
          <Input placeholder="Enter employee name" />
        </Form.Item>
        <Form.Item label="Email" className="font-medium">
          <Input placeholder="Enter email" disabled={true} />
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
            loading={loading}
            icon={<SaveOutlined />}
          >
            Update
          </Button>
          <Button
            type="primary"
            danger
            shape="round"
            icon={<CloseOutlined />}
            onClick={() => setShowEmployeeEdit(false)}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EmployeeManagementEdit;
