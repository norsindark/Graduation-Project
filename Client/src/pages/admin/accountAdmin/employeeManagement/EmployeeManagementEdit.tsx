import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { callUpdateEmployee } from '../../../../services/serverApi';

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
    setLoading(true);
    try {
      const response = await callUpdateEmployee(
        currentEmployee.employeeId,
        values.employeeName,
        values.email,
        values.salary,
        values.jobTitle
      );
      if (response?.status === 200) {
        notification.success({
          message: 'Cập nhật nhân viên thành công!',
          duration: 5,
          showProgress: true,
        });
        onEditSuccess();
      } else {
        notification.error({
          message: 'Cập nhật nhân viên thất bại',
          description: response.data.errors?.error || 'Đã xảy ra lỗi!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi khi cập nhật nhân viên',
        description: 'Đã xảy ra lỗi trong quá trình cập nhật!',
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
        Chỉnh sửa thông tin nhân viên
      </h4>
      <Form
        form={form}
        layout="vertical"
        initialValues={currentEmployee}
        onFinish={onFinish}
      >
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
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
          <Button
            onClick={() => setShowEmployeeEdit(false)}
            style={{ marginLeft: 10 }}
          >
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EmployeeManagementEdit;
