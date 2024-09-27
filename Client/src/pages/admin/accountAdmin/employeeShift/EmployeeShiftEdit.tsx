import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Button, notification } from 'antd';
import moment from 'moment';
import {
  callUpdateEmployeeShift,
  callGetAllEmployees,
  callGetAllShift,
} from '../../../../services/serverApi';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

interface EmployeeShift {
  id: string;
  employee: {
    id: string;
    employeeName: string;
    salary: number;
    jobTitle: string;
    createdAt: string;
    updatedAt: string;
  };
  shift: {
    id: string;
    shiftName: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
  };
  workDate: string;
  newWorkDate: string;
  status: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EmployeeShiftEditProps {
  currentEmployeeShift: EmployeeShift;
  onEditSuccess: () => void;
  setShowEmployeeShiftEdit: (show: boolean) => void;
}

const EmployeeShiftEdit: React.FC<EmployeeShiftEditProps> = ({
  currentEmployeeShift,
  onEditSuccess,
  setShowEmployeeShiftEdit,
}) => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchShifts();
    form.setFieldsValue({
      employeeId: currentEmployeeShift.employee.id,
      shiftId: currentEmployeeShift.shift.id,
      workDate: moment(currentEmployeeShift.workDate),
      newWorkDate: '',
    });
  }, [currentEmployeeShift, form]);

  const fetchEmployees = async () => {
    try {
      const response = await callGetAllEmployees();
      if (response?.status === 200) {
        setEmployees(response.data);
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi khi tải danh sách nhân viên',
        description: 'Đã xảy ra lỗi khi tải dữ liệu nhân viên!',
      });
    }
  };

  const fetchShifts = async () => {
    try {
      const response = await callGetAllShift('');
      if (response?.status === 200) {
        setShifts(response.data._embedded.shiftResponseList);
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi khi tải danh sách ca làm việc',
        description: 'Đã xảy ra lỗi khi tải dữ liệu ca làm việc!',
      });
    }
  };

  const onFinish = async (values: any) => {
    console.log(values);
    setIsSubmitting(true);
    try {
      const response = await callUpdateEmployeeShift(
        currentEmployeeShift.employee.id,
        currentEmployeeShift.shift.id,
        moment(currentEmployeeShift.workDate).format('YYYY-MM-DD'),
        values.newWorkDate.format('YYYY-MM-DD')
      );
      if (response?.status === 200) {
        notification.success({
          message: 'Update employee shift successfully!',
          duration: 5,
          showProgress: true,
        });
        onEditSuccess();
      } else {
        notification.error({
          message: 'Update employee shift failed!',
          description: response.data.errors?.error || 'An error occurred!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error updating employee shift',
        description: 'An error occurred in the update process!',
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
        Edit employee shift
      </h4>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="employeeId"
          className="font-medium"
          label="Employee"
          rules={[{ required: true, message: 'Please select an employee!' }]}
        >
          <Select placeholder="Select employee" disabled>
            {employees.map((employee) => (
              <Option key={employee.id} value={employee.id}>
                {employee.employeeName} - {employee.email}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="shiftId"
          label="Shift"
          className="font-medium"
          rules={[{ required: true, message: 'Please select a shift!' }]}
        >
          <Select placeholder="Select shift" disabled>
            {shifts.map((shift) => (
              <Option key={shift.shiftId} value={shift.shiftId}>
                {shift.shiftName} - Time: {shift.startTime} - {shift.endTime}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="workDate"
          className="font-medium"
          label="Work date"
          rules={[{ required: true, message: 'Please select a work date!' }]}
        >
          <DatePicker style={{ width: '100%' }} disabled />
        </Form.Item>

        <Form.Item
          name="newWorkDate"
          className="font-medium"
          label="New work date"
          rules={[
            { required: true, message: 'Please select a new work date!' },
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
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
            type="primary"
            shape="round"
            danger
            onClick={() => setShowEmployeeShiftEdit(false)}
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

export default EmployeeShiftEdit;
