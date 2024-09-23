import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { callAddNewEmployee } from '../../../../services/serverApi';
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

  const onFinish = async (values: any) => {
    const { employeeName, email, salary, jobTitle } = values;
    setIsSubmitting(true);
    try {
      const response = await callAddNewEmployee(
        employeeName,
        email,
        salary,
        jobTitle
      );
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
          name="employeeName"
          label="Employee Name"
          rules={[{ required: true, message: 'Please enter employee name!' }]}
        >
          <Input placeholder="Enter employee name" />
        </Form.Item>
        <Form.Item
          label="Employee"
          name="employees"
          rules={[
            { required: true, message: 'Please select at least one employee!' },
          ]}
        >
          <Select mode="multiple" placeholder="Select employee">
            <Select.Option value="employee1">Employee 1</Select.Option>
            <Select.Option value="employee2">Employee 2</Select.Option>
            <Select.Option value="employee3">Employee 3</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="salary"
          label="Salary"
          rules={[{ required: true, message: 'Please enter salary!' }]}
        >
          <Input placeholder="Enter salary" />
        </Form.Item>
        <Form.Item
          name="jobTitle"
          label="Job Title"
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
            Add Employee
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
