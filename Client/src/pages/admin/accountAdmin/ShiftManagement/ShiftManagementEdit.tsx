import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  notification,
  Select,
  DatePicker,
  TimePicker,
} from 'antd';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import {
  callUpdateShift,
  callGetAllEmployees,
} from '../../../../services/serverApi';
import moment from 'moment';

interface Employee {
  employeeId: string;
  employeeName: string;
  email: string;
  jobTitle: string;
  salary: string;
}

interface ShiftEditProps {
  currentShift: {
    shiftId: string; // Thay đổi từ 'id' sang 'shiftId'
    shiftName: string;
    startTime: string;
    endTime: string;
    employees: Employee[]; // Thay đổi từ 'employeeIds' sang 'employees'
  };
  onEditSuccess: () => void;
  setShowShiftEdit: (show: boolean) => void;
}

const ShiftManagementEdit: React.FC<ShiftEditProps> = ({
  currentShift,
  onEditSuccess,
  setShowShiftEdit,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [employees, setEmployees] = useState<
    { id: string; employeeName: string; email: string }[]
  >([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const responseAllEmployees = await callGetAllEmployees();
        if (responseAllEmployees?.status === 200) {
          setEmployees(responseAllEmployees.data);
        }
      } catch (error) {
        console.error('Error fetching employee list:', error);
        notification.error({
          message: 'Error',
          description: 'Unable to fetch employee list. Please try again later.',
        });
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      shiftName: currentShift.shiftName,
      startTime: moment(currentShift.startTime, 'HH:mm'),
      endTime: moment(currentShift.endTime, 'HH:mm'),
      employeeIds: currentShift.employees.map((emp) => emp.employeeId),
    });
  }, [currentShift, form]);

  const onFinish = async (values: {
    shiftName: string;
    startTime: moment.Moment;
    endTime: moment.Moment;
    employeeIds: string[];
  }) => {
    const { shiftName, startTime, endTime, employeeIds } = values;
    setIsSubmitting(true);
    try {
      const response = await callUpdateShift(
        currentShift.shiftId,
        shiftName,
        startTime.format('HH:mm'),
        endTime.format('HH:mm'),
        employeeIds
      );
      if (response?.status === 200) {
        notification.success({
          message: 'Update shift successfully!',
          duration: 5,
          showProgress: true,
        });
        onEditSuccess();
      } else {
        notification.error({
          message: 'Update shift failed!',
          description: response.data.errors?.error || 'An error occurred!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error updating shift',
        description: 'An error occurred during the update process!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h4 className="text-center p-3 font-[500] text-[18px]">Edit Shift</h4>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Shift name"
          name="shiftName"
          className="font-medium"
          rules={[{ required: true, message: 'Please enter shift name!' }]}
        >
          <Input placeholder="Shift name" />
        </Form.Item>
        <Form.Item
          label="Start time"
          name="startTime"
          rules={[{ required: true, message: 'Please select start time!' }]}
          className="font-medium"
        >
          <TimePicker style={{ width: '100%' }} format="HH:mm" />
        </Form.Item>
        <Form.Item
          label="End time"
          name="endTime"
          className="font-medium"
          rules={[{ required: true, message: 'Please select end time!' }]}
        >
          <TimePicker style={{ width: '100%' }} format="HH:mm" />
        </Form.Item>
        <Form.Item
          label="Employee"
          name="employeeIds"
          rules={[
            { required: true, message: 'Please select at least one employee!' },
          ]}
          className="font-medium"
        >
          <Select mode="multiple" placeholder="Select employee">
            {employees.map((employee) => (
              <Select.Option key={employee.id} value={employee.id}>
                {employee.employeeName} ({employee.email})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Button
          type="primary"
          shape="round"
          htmlType="submit"
          loading={isSubmitting}
          icon={<SaveOutlined />}
        >
          Save changes
        </Button>
        <Button
          icon={<CloseOutlined />}
          danger
          size="large"
          style={{ fontWeight: 'medium', margin: '0 10px' }}
          shape="round"
          type="primary"
          onClick={() => setShowShiftEdit(false)}
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default ShiftManagementEdit;
