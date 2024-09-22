import moment from 'moment';
import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  notification,
  Select,
  DatePicker,
  TimePicker,
} from 'antd';
// import { callAddShift } from '../../../../services/clientApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useNavigate } from 'react-router-dom';

const ShiftManagementNew = ({
  onAddSuccess,
  setShowShiftNew,
}: {
  onAddSuccess: () => void;
  setShowShiftNew: (show: boolean) => void;
}) => {
  const userId = useSelector((state: RootState) => state.account.user?.id);
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
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
        description: 'Vui lòng đăng nhập để tạo ca làm việc mới',
        duration: 5,
        showProgress: true,
      });
      setIsSubmit(false);
      navigate('/login');
      return;
    }
    setIsSubmit(true);
    try {
      // const response = await callAddShift(
      //   name,
      //   date.format('YYYY-MM-DD'),
      //   startTime.format('HH:mm'),
      //   endTime.format('HH:mm'),
      //   employees,
      //   userId
      // );
      // if (response?.status === 200) {
      //   notification.success({
      //     message: 'Tạo ca làm việc thành công!',
      //     duration: 5,
      //     showProgress: true,
      //   });
      //   onAddSuccess();
      // } else {
      //   notification.error({
      //     message: 'Tạo ca làm việc thất bại',
      //     description: response.data.errors?.error || 'Đã xảy ra lỗi!',
      //     duration: 5,
      //     showProgress: true,
      //   });
      // }
    } catch (shiftError) {
      notification.error({
        message: 'Lỗi khi tạo ca làm việc',
        description:
          shiftError instanceof Error
            ? shiftError.message
            : 'Đã xảy ra lỗi trong quá trình tạo ca làm việc!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="container text-medium">
      <h4 className="fp__dsahboard_overview_item text-center flex justify-center items-center p-3 font-[500] text-[18px]">
        Tạo ca làm việc mới
      </h4>
      <Form layout="vertical" onFinish={onFinish}>
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
          loading={isSubmit}
        >
          <div className="text-[16px] font-medium text-center">
            Lưu ca làm việc
          </div>
        </Button>
        <Button
          danger
          size="large"
          style={{ fontWeight: 'medium', margin: '0 10px' }}
          shape="round"
          type="primary"
          className="cancel_new_shift"
          onClick={() => setShowShiftNew(false)}
        >
          <div className="text-[16px] font-medium text-center">Hủy</div>
        </Button>
      </Form>
    </div>
  );
};

export default ShiftManagementNew;
