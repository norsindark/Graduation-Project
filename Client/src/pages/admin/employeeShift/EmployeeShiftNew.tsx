import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Button, notification } from 'antd';
import moment from 'moment';
import {
  callAddNewEmployeeShift,
  callGetAllEmployees,
  callGetAllShift,
} from '../../../services/serverApi';
import { CalendarOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface EmployeeShiftNewProps {
  onAddSuccess: () => void;
  setShowEmployeeShiftNew: (show: boolean) => void;
}

const EmployeeShiftNew: React.FC<EmployeeShiftNewProps> = ({
  onAddSuccess,
  setShowEmployeeShiftNew,
}) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchShifts();
  }, []);

  const fetchEmployees = async () => {
    try {
      const responseGetAllEmployees = await callGetAllEmployees();
      if (responseGetAllEmployees?.status === 200) {
        setEmployees(responseGetAllEmployees.data);
      }
    } catch (error) {
      notification.error({
        message: 'Error loading employee list',
        description: 'An error occurred while loading employee data!',
        duration: 5,
        showProgress: true,
      });
    }
  };

  const fetchShifts = async () => {
    try {
      const responseGetAllShift = await callGetAllShift('');
      if (responseGetAllShift?.status === 200) {
        setShifts(responseGetAllShift.data._embedded.shiftResponseList);
      }
    } catch (error) {
      notification.error({
        message: 'Error loading shift list',
        description: 'An error occurred while loading shift data!',
        duration: 5,
        showProgress: true,
      });
    }
  };

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      const response = await callAddNewEmployeeShift(
        values.employeeIds,
        values.shiftId,
        values.dateRange[0].format('YYYY-MM-DD'),
        values.dateRange[1].format('YYYY-MM-DD')
      );
      if (response?.status === 200) {
        notification.success({
          message: 'Create new employee shift successfully!',
          duration: 5,
          showProgress: true,
        });
        onAddSuccess();
      } else {
        notification.error({
          message: 'Unable to create new employee shift',
          description: response.data.errors?.error || 'An error occurred!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error creating new employee shift',
        description: 'An error occurred while creating the shift!',
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
        Create New Employee Shift
      </h4>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="employeeIds"
          className="font-medium"
          label="Employees"
          rules={[
            { required: true, message: 'Please select at least one employee!' },
          ]}
        >
          <Select mode="multiple" placeholder="Select employees">
            {employees.map((employee) => (
              <Option key={employee.id} value={employee.id}>
                {employee.employeeName} - {employee.email}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="shiftId"
          className="font-medium"
          label="Shift"
          rules={[{ required: true, message: 'Please select a shift!' }]}
        >
          <Select placeholder="Select shift" allowClear>
            {shifts.map((shift) => (
              <Option key={shift.shiftId} value={shift.shiftId}>
                {shift.shiftName} - Time: {shift.startTime} - {shift.endTime}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="dateRange"
          className="font-medium"
          label="Date Range"
          rules={[{ required: true, message: 'Please select a date range!' }]}
        >
          <RangePicker />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            loading={isSubmitting}
            icon={<CalendarOutlined />}
          >
            Create New Employee Shift
          </Button>
          <Button
            type="primary"
            shape="round"
            danger
            onClick={() => setShowEmployeeShiftNew(false)}
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

export default EmployeeShiftNew;
