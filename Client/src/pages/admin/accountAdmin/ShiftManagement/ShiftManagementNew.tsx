import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Form, Input, Button, notification, Select, TimePicker } from 'antd';
import { callAddNewShift } from '../../../../services/serverApi';
import { CalendarOutlined, CloseOutlined } from '@ant-design/icons';

interface ShiftManagementNewProps {
  onAddSuccess: () => void;
  setShowShiftNew: (show: boolean) => void;
}

const ShiftManagementNew: React.FC<ShiftManagementNewProps> = ({
  onAddSuccess,
  setShowShiftNew,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values: {
    shiftName: string;
    startTime: moment.Moment;
    endTime: moment.Moment;
  }) => {
    const { shiftName, startTime, endTime } = values;
    setIsSubmitting(true);
    try {
      const response = await callAddNewShift(
        shiftName,
        startTime.format('HH:mm'),
        endTime.format('HH:mm')
      );
      if (response?.status === 200) {
        notification.success({
          message: 'Shift created successfully!',
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
        Create New Shift
      </h4>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Shift Name"
          className="font-medium"
          name="shiftName"
          rules={[{ required: true, message: 'Please enter the shift name!' }]}
        >
          <Input placeholder="Shift name" />
        </Form.Item>
        <Form.Item
          label="Start Time"
          className="font-medium"
          name="startTime"
          rules={[{ required: true, message: 'Please select the start time!' }]}
        >
          <TimePicker style={{ width: '100%' }} format="HH:mm" />
        </Form.Item>
        <Form.Item
          label="End Time"
          className="font-medium"
          name="endTime"
          rules={[{ required: true, message: 'Please select the end time!' }]}
        >
          <TimePicker style={{ width: '100%' }} format="HH:mm" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            loading={isSubmitting}
            icon={<CalendarOutlined />}
          >
            Save Shift
          </Button>
          <Button
            type="primary"
            shape="round"
            danger
            onClick={() => setShowShiftNew(false)}
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

export default ShiftManagementNew;
