import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, notification } from 'antd';
import axios from 'axios';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;

interface ProductEditProps {
  currentItem: ProductItem;
  onEditSuccess: () => void;
  setShowProductEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface ProductItem {
  id: number;
  name: string;
  description: string;
  price: number;
  ingredients: Ingredient[];
  preparationTime: number;
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  image?: string;
}
interface WarehouseItem {
  id: number;
  name: string;
  // Thêm các trường khác nếu cần
}
const ProductEdit: React.FC<ProductEditProps> = ({
  currentItem,
  onEditSuccess,
  setShowProductEdit,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([]);

  useEffect(() => {
    fetchWarehouseItems();
  }, []);

  const fetchWarehouseItems = async () => {
    try {
      const response = await axios.get('/api/warehouse-items');
      if (Array.isArray(response.data)) {
        setWarehouseItems(response.data);
      } else {
        console.error('Dữ liệu nhận được không phải là mảng:', response.data);
        setWarehouseItems([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách nguyên liệu:', error);
      notification.error({
        message: 'Không thể tải danh sách nguyên liệu',
        duration: 5,
      });
    }
  };

  const onFinish = async (values: ProductItem) => {
    setIsSubmit(true);
    try {
      await axios.put(`/api/products/${currentItem.id}`, values);
      notification.success({
        message: 'Sản phẩm đã được cập nhật thành công!',
        duration: 5,
      });
      onEditSuccess();
    } catch (error: any) {
      notification.error({
        message: 'Lỗi khi cập nhật sản phẩm',
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
        Chỉnh sửa sản phẩm
      </h4>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={currentItem}
      >
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="price"
          label="Giá"
          rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="ingredients"
          label="Nguyên liệu"
          rules={[{ required: true, message: 'Vui lòng chọn nguyên liệu!' }]}
        >
          <Select mode="multiple">
            {warehouseItems.map((item) => (
              <Option key={item.id} value={item.id.toString()}>
                {item.name}
              </Option>
            ))}
          </Select>
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
            onClick={() => setShowProductEdit(false)}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProductEdit;
