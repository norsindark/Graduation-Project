import React, { useState, useEffect } from 'react';
import { Button, Form, Input, notification, TimePicker } from 'antd';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { callUpdateShift } from '../../../../services/serverApi';
import moment from 'moment';

interface ShiftEditProps {
  currentShift: {
    shiftId: string;
    shiftName: string;
    startTime: string;
    endTime: string;
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

  useEffect(() => {
    form.setFieldsValue({
      shiftName: currentShift.shiftName,
      startTime: moment(currentShift.startTime, 'HH:mm'),
      endTime: moment(currentShift.endTime, 'HH:mm'),
    });
  }, [currentShift, form]);

  const onFinish = async (values: {
    shiftName: string;
    startTime: moment.Moment;
    endTime: moment.Moment;
  }) => {
    const { shiftName, startTime, endTime } = values;

    setIsSubmitting(true);
    try {
      const response = await callUpdateShift(
        currentShift.shiftId,
        shiftName,
        startTime.format('HH:mm'),
        endTime.format('HH:mm')
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
