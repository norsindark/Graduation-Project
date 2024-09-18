import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
  notification,
  Select,
  DatePicker,
  TimePicker,
} from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
// import { callUpdateShift } from '../../../../services/clientApi';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const EmployeeShiftManagementEdit = ({
  currentShift,
  onEditSuccess,
  setShowShiftEdit,
}: {
  currentShift: {
    id: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    employees: string[];
  };
  onEditSuccess: () => void;
  setShowShiftEdit: (show: boolean) => void;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.account.user?.id);
  const navigate = useNavigate();
  const { Option } = Select;

  const onFinish = async (values: {
    name: string;
    date: moment.Moment;
    startTime: moment.Moment;
    endTime: moment.Moment;
    employees: string[];
  }) => {
    const { name, date, startTime, endTime, employees } = values;
    if (!userId) {
      notification.error({
        message: 'Không tìm thấy người dùng',
        description: 'Vui lòng đăng nhập để chỉnh sửa ca làm việc',
        duration: 5,
        showProgress: true,
      });
      setLoading(false);
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      // const response = await callUpdateShift(
      //   currentShift.id,
      //   name,
      //   date.format('YYYY-MM-DD'),
      //   startTime.format('HH:mm'),
      //   endTime.format('HH:mm'),
      //   employees,
      //   userId
      // );
      // if (response?.status === 200) {
      //   notification.success({
      //     message: 'Cập nhật ca làm việc thành công!',
      //     duration: 5,
      //     showProgress: true,
      //   });
      //   onEditSuccess();
      // } else {
      //   notification.error({
      //     message: 'Cập nhật ca làm việc thất bại',
      //     description: response.data.errors?.error || 'Đã xảy ra lỗi!',
      //     duration: 5,
      //     showProgress: true,
      //   });
      // }
    } catch (error) {
      notification.error({
        message: 'Lỗi khi cập nhật ca làm việc',
        description:
          error instanceof Error
            ? error.message
            : 'Đã xảy ra lỗi trong quá trình cập nhật!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-medium">
      <h4 className="fp__dsahboard_overview_item text-center flex justify-center items-center p-3 font-[500] text-[18px]">
        Chỉnh sửa ca làm việc
      </h4>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...currentShift,
          date: moment(currentShift.date),
          startTime: moment(currentShift.startTime, 'HH:mm'),
          endTime: moment(currentShift.endTime, 'HH:mm'),
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Tên ca"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên ca làm việc!' },
          ]}
        >
          <Input placeholder="Tên ca làm việc" />
        </Form.Item>
        <Form.Item
          label="Ngày"
          name="date"
          rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Giờ bắt đầu"
          name="startTime"
          rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu!' }]}
        >
          <TimePicker style={{ width: '100%' }} format="HH:mm" />
        </Form.Item>
        <Form.Item
          label="Giờ kết thúc"
          name="endTime"
          rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc!' }]}
        >
          <TimePicker style={{ width: '100%' }} format="HH:mm" />
        </Form.Item>
        <Form.Item
          label="Nhân viên"
          name="employees"
          rules={[
            { required: true, message: 'Vui lòng chọn ít nhất một nhân viên!' },
          ]}
        >
          <Select mode="multiple" placeholder="Chọn nhân viên">
            <Option value="employee1">Nhân viên 1</Option>
            <Option value="employee2">Nhân viên 2</Option>
            <Option value="employee3">Nhân viên 3</Option>
          </Select>
        </Form.Item>
        <Button
          type="primary"
          shape="round"
          htmlType="submit"
          size="large"
          loading={loading}
        >
          <div className="text-[16px] font-medium text-center">
            Lưu thay đổi
          </div>
        </Button>
        <Button
          danger
          size="large"
          style={{ fontWeight: 'medium', margin: '0 10px' }}
          shape="round"
          type="primary"
          className="cancel_edit_shift"
          onClick={() => setShowShiftEdit(false)}
        >
          <div className="text-[16px] font-medium text-center">Hủy</div>
        </Button>
      </Form>
    </div>
  );
};

export default EmployeeShiftManagementEdit;
