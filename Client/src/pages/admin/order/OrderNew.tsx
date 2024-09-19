import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  InputNumber,
  notification,
} from 'antd';
import axios from 'axios';

const { Option } = Select;

interface OrderNewProps {
  onAddSuccess: () => void;
  setShowOrderNew: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const OrderNew: React.FC<OrderNewProps> = ({
  onAddSuccess,
  setShowOrderNew,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm:', error);
      notification.error({
        message: 'Không thể tải danh sách sản phẩm',
        duration: 5,
      });
    }
  };

  const checkInventory = async (productId: number, quantity: number) => {
    try {
      const response = await axios.get(`/api/inventory/${productId}`);
      const inventoryQuantity = response.data.quantity;
      return inventoryQuantity >= quantity;
    } catch (error) {
      console.error('Lỗi khi kiểm tra tồn kho:', error);
      return false;
    }
  };

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      for (const product of values.products) {
        const hasEnoughInventory = await checkInventory(
          product.id,
          product.quantity
        );
        if (!hasEnoughInventory) {
          throw new Error(
            `Sản phẩm ${product.name} không đủ số lượng trong kho.`
          );
        }
      }
      await axios.post('/api/orders', values);
      notification.success({
        message: 'Đơn hàng đã được thêm thành công!',
        duration: 5,
      });
      onAddSuccess();
    } catch (error: any) {
      notification.error({
        message: 'Lỗi khi thêm đơn hàng mới',
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
        Thêm đơn hàng mới
      </h4>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="customerName"
          label="Tên khách hàng"
          rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="orderDate"
          label="Ngày đặt hàng"
          rules={[{ required: true, message: 'Vui lòng chọn ngày đặt hàng!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.List name="products">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  required={false}
                  key={field.key}
                  label={index === 0 ? 'Sản phẩm' : ''}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Vui lòng chọn sản phẩm hoặc xóa trường này.',
                      },
                    ]}
                    noStyle
                  >
                    <Select
                      style={{ width: '60%' }}
                      placeholder="Chọn sản phẩm"
                    >
                      {products.map((product) => (
                        <Option key={product.id} value={product.id}>
                          {product.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số lượng.',
                      },
                    ]}
                    noStyle
                  >
                    <InputNumber
                      placeholder="Số lượng"
                      style={{ width: '30%', marginLeft: '8px' }}
                      min={1}
                    />
                  </Form.Item>
                  {fields.length > 1 && (
                    <Button
                      type="link"
                      onClick={() => remove(field.name)}
                      style={{ marginLeft: '8px' }}
                    >
                      Xóa
                    </Button>
                  )}
                </Form.Item>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Thêm sản phẩm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select>
            <Option value="Đang xử lý">Đang xử lý</Option>
            <Option value="Đã xác nhận">Đã xác nhận</Option>
            <Option value="Đang giao hàng">Đang giao hàng</Option>
            <Option value="Đã hoàn thành">Đã hoàn thành</Option>
            <Option value="Đã hủy">Đã hủy</Option>
          </Select>
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
            onClick={() => setShowOrderNew(false)}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default OrderNew;
