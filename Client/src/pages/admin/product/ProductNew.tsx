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
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface ProductNewProps {
  onAddSuccess: () => void;
  setShowProductNew: React.Dispatch<React.SetStateAction<boolean>>;
}

interface WarehouseItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  minThreshold: number;
  expirationDate: string;
  supplier: string;
  image?: string;
  preparationTime: number;
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const ProductNew: React.FC<ProductNewProps> = ({
  onAddSuccess,
  setShowProductNew,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

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
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <Select>
            <Option value="thịt">Thịt</Option>
            <Option value="rau củ">Rau củ</Option>
            <Option value="gia vị">Gia vị</Option>
            <Option value="đồ khô">Đồ khô</Option>
            <Option value="khác">Khác</Option>
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
        <Form.Item
          name="image"
          label="Ảnh sản phẩm"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
        >
          <Upload
            name="image"
            listType="picture"
            maxCount={1}
            beforeUpload={(file) => {
              const isJpgOrPng =
                file.type === 'image/jpeg' || file.type === 'image/png';
              if (!isJpgOrPng) {
                message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
              }
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                message.error('Ảnh phải nhỏ hơn 2MB!');
              }
              return isJpgOrPng && isLt2M;
            }}
          >
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="preparationTime"
          label="Thời gian chuẩn bị (phút)"
          rules={[
            { required: true, message: 'Vui lòng nhập thời gian chuẩn bị!' },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="allergens"
          label="Thông tin dị ứng"
          rules={[
            { required: true, message: 'Vui lòng nhập thông tin dị ứng!' },
          ]}
        >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Nhập thông tin dị ứng"
          >
            <Option value="Gluten">Gluten</Option>
            <Option value="Sữa">Sữa</Option>
            <Option value="Đậu nành">Đậu nành</Option>
            <Option value="Hạt">Hạt</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Thông tin dinh dưỡng" required>
          <Input.Group compact>
            <Form.Item
              name={['nutritionalInfo', 'calories']}
              rules={[{ required: true, message: 'Vui lòng nhập calories!' }]}
              style={{ width: '25%' }}
            >
              <InputNumber placeholder="Calories" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name={['nutritionalInfo', 'protein']}
              rules={[{ required: true, message: 'Vui lòng nhập protein!' }]}
              style={{ width: '25%' }}
            >
              <InputNumber
                placeholder="Protein (g)"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              name={['nutritionalInfo', 'carbs']}
              rules={[{ required: true, message: 'Vui lòng nhập carbs!' }]}
              style={{ width: '25%' }}
            >
              <InputNumber placeholder="Carbs (g)" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name={['nutritionalInfo', 'fat']}
              rules={[{ required: true, message: 'Vui lòng nhập fat!' }]}
              style={{ width: '25%' }}
            >
              <InputNumber placeholder="Fat (g)" style={{ width: '100%' }} />
            </Form.Item>
          </Input.Group>
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
            onClick={() => setShowProductNew(false)}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProductNew;
