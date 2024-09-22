import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { callAddNewEmployee } from '../../../../services/serverApi';

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
    setIsSubmitting(true);
    try {
      const response = await callAddNewEmployee(
        values.employeeName,
        values.email,
        values.salary,
        values.jobTitle
      );
      if (response?.status === 200) {
        notification.success({
          message: 'Thêm nhân viên thành công!',
          duration: 5,
          showProgress: true,
        });
        onAddSuccess();
      } else {
        notification.error({
          message: 'Thêm nhân viên thất bại',
          description: response.data.errors?.error || 'Đã xảy ra lỗi!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi khi thêm nhân viên',
        description: 'Đã xảy ra lỗi trong quá trình thêm nhân viên!',
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
        Thêm nhân viên mới
      </h4>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="employeeName"
          label="Tên nhân viên"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
        >
          <Input placeholder="Nhập tên nhân viên" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          name="salary"
          label="Lương"
          rules={[{ required: true, message: 'Vui lòng nhập lương!' }]}
        >
          <Input placeholder="Nhập lương" />
        </Form.Item>
        <Form.Item
          name="jobTitle"
          label="Chức vụ"
          rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
        >
          <Input placeholder="Nhập chức vụ" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Thêm nhân viên
          </Button>
          <Button
            onClick={() => setShowEmployeeNew(false)}
            style={{ marginLeft: 10 }}
          >
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EmployeeManagementNew;
