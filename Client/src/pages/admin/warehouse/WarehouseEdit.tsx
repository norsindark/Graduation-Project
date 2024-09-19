import React, { useState, useEffect } from 'react';
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
import moment from 'moment';

const { Option } = Select;

interface WarehouseEditProps {
  currentItem: WarehouseItem;
  onEditSuccess: () => void;
  setShowWarehouseEdit: (value: boolean) => void;
}

interface WarehouseItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  minThreshold: number;
  expirationDate: string;
  supplier: string;
}

const WarehouseEdit: React.FC<WarehouseEditProps> = ({
  currentItem,
  onEditSuccess,
  setShowWarehouseEdit,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      ...currentItem,
      expirationDate: moment(currentItem.expirationDate),
    });
  }, [currentItem, form]);

  const onFinish = async (values: WarehouseItem) => {
    setIsSubmit(true);
    try {
      const updatedValues = {
        ...values,
        expirationDate: moment(values.expirationDate).format('YYYY-MM-DD'),
      };
      // Giả lập API call
      console.log('Cập nhật mặt hàng:', updatedValues);
      // await axios.put(`/api/warehouse-items/${currentItem.id}`, updatedValues);
      notification.success({
        message: 'Mặt hàng đã được cập nhật thành công!',
        duration: 5,
      });
      onEditSuccess();
    } catch (error: any) {
      notification.error({
        message: 'Lỗi khi cập nhật mặt hàng',
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
        Chỉnh sửa mặt hàng
      </h4>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          ...currentItem,
          expirationDate: moment(currentItem.expirationDate),
        }}
      >
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
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <Select>
            <Option value="Thực phẩm">Thực phẩm</Option>
            <Option value="Đồ uống">Đồ uống</Option>
            <Option value="Gia vị">Gia vị</Option>
            <Option value="Khác">Khác</Option>
          </Select>
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
            Cập nhật
          </Button>
          <Button
            danger
            size="large"
            shape="round"
            onClick={() => setShowWarehouseEdit(false)}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default WarehouseEdit;
