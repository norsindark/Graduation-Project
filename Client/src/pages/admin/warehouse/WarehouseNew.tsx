import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  notification,
  DatePicker,
} from 'antd';
import axios from 'axios';

const { Option } = Select;

interface WarehouseNewProps {
  onAddSuccess: () => void;
  setShowWarehouseNew: (value: boolean) => void;
}
interface WarehouseItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  minThreshold: number;
  expirationDate: string;
  supplier: string;
}

const WarehouseNew: React.FC<WarehouseNewProps> = ({
  onAddSuccess,
  setShowWarehouseNew,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const handleCategoryChange = (value: string) => {
    if (value === 'khác') {
      setIsCustomCategory(true);
      form.setFieldsValue({ category: '' });
    } else {
      setIsCustomCategory(false);
      form.setFieldsValue({ category: value });
    }
  };

  const onFinish = async (values: WarehouseItem) => {
    setIsSubmit(true);
    try {
      await axios.post('/api/warehouse-items', values);
      notification.success({
        message: 'Mặt hàng đã được thêm thành công!',
        duration: 5,
      });
      onAddSuccess();
    } catch (error: any) {
      notification.error({
        message: 'Lỗi khi thêm mặt hàng mới',
        description: error.message,
        duration: 5,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white shadow rounded-md">
      <h4 className="text-center text-xl font-semibold mb-4">
        Thêm mặt hàng mới
      </h4>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          label="Tên mặt hàng"
          rules={[{ required: true, message: 'Vui lòng nhập tên mặt hàng!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Số lượng"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="unit"
          label="Đơn vị"
          rules={[{ required: true, message: 'Vui lòng chọn đơn vị!' }]}
        >
          <Select>
            <Option value="kg">Kg</Option>
            <Option value="g">Gram</Option>
            <Option value="l">Lít</Option>
            <Option value="ml">Mililít</Option>
            <Option value="cái">Cái</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="category"
          label="Danh mục"
          rules={[
            { required: true, message: 'Vui lòng chọn hoặc nhập danh mục!' },
          ]}
        >
          {isCustomCategory ? (
            <Input placeholder="Nhập danh mục mới" />
          ) : (
            <Select onChange={handleCategoryChange}>
              <Option value="thịt">Thịt</Option>
              <Option value="rau củ">Rau củ</Option>
              <Option value="gia vị">Gia vị</Option>
              <Option value="đồ khô">Đồ khô</Option>
              <Option value="khác">Khác</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item
          name="minThreshold"
          label="Ngưỡng tối thiểu"
          rules={[
            { required: true, message: 'Vui lòng nhập ngưỡng tối thiểu!' },
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="expirationDate"
          label="Ngày hết hạn"
          rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="supplier"
          label="Nhà cung cấp"
          rules={[{ required: true, message: 'Vui lòng nhập nhà cung cấp!' }]}
        >
          <Input />
        </Form.Item>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmit}
            size="large"
            shape="round"
            className="w-full sm:w-auto"
          >
            Thêm mới
          </Button>
          <Button
            danger
            size="large"
            shape="round"
            onClick={() => setShowWarehouseNew(false)}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default WarehouseNew;
