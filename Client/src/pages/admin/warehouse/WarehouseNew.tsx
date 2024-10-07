import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  notification,
  DatePicker,
  Row,
  Col,
} from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
import {
  callAddNewWarehouse,
  callGetAllCategoriesName,
} from '../../../services/serverApi';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
interface WarehouseNewProps {
  onAddSuccess: () => void;
  setShowWarehouseNew: (value: boolean) => void;
}

interface WarehouseItem {
  ingredientName: string;
  importedQuantity: number;
  availableQuantity: number;
  unit: string;
  expiredDate: string;
  importedDate: string;
  importedPrice: number;
  supplierName: string;
  description: string;
  categoryId: string;
}
interface Category {
  categoryId: string;
  categoryName: string;
}

const WarehouseNew: React.FC<WarehouseNewProps> = ({
  onAddSuccess,
  setShowWarehouseNew,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategoryList = async () => {
      const responseCategory = await callGetAllCategoriesName();
      setCategoryList(responseCategory.data);
    };
    fetchCategoryList();
  }, []);

  const onFinish = async (values: WarehouseItem) => {
    const {
      ingredientName,
      importedQuantity,
      unit,
      expiredDate,
      importedDate,
      importedPrice,
      supplierName,
      description,
      categoryId,
    } = values;

    const formattedImportedDate = dayjs(importedDate).format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    const formattedExpiredDate = dayjs(expiredDate).format(
      'YYYY-MM-DDTHH:mm:ss'
    );

    setIsSubmit(true);
    try {
      const responseWarehouse = await callAddNewWarehouse(
        ingredientName,
        importedQuantity,
        unit,
        formattedExpiredDate,
        formattedImportedDate,
        importedPrice,
        supplierName,
        description,
        categoryId
      );
      if (responseWarehouse.status === 200) {
        notification.success({
          message: 'Item created successfully!',
          duration: 5,
          showProgress: true,
        });
        form.resetFields();
        onAddSuccess();
      } else {
        notification.error({
          message: 'Error creating item',
          description:
            responseWarehouse.data.errors?.error ||
            'An error occurred while adding the new item. Please try again.',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error creating item',
        description:
          error.message ||
          'An error occurred while adding the new item. Please try again.',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <h4 className="text-center text-xl font-semibold mb-4">
        Create new item
      </h4>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="ingredientName"
              label="Ingredient name"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter ingredient name!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="importedQuantity"
              label="Imported quantity"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter imported quantity!' },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === null || value === '') {
                      return Promise.reject('Imported quantity is required!');
                    }
                    if (isNaN(value)) {
                      return Promise.reject(
                        'Imported quantity must be a number!'
                      );
                    }
                    if (value < 0) {
                      return Promise.reject(
                        'Imported quantity cannot be negative!'
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="unit"
              label="Unit"
              className="font-medium"
              rules={[{ required: true, message: 'Please select unit!' }]}
            >
              <Select>
                <Option value="kilogram">Kilogram</Option>
                <Option value="gram">Gram</Option>
                <Option value="liter">Liter</Option>
                <Option value="milliliter">Milliliter</Option>
                <Option value="piece">Piece</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Category"
              className="font-medium"
              name="categoryId"
              rules={[{ required: true, message: 'Please select category!' }]}
            >
              <Select placeholder="Select category">
                {categoryList.map((category) => (
                  <Select.Option
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {category.categoryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="importedDate"
              label="Imported date"
              className="font-medium"
              rules={[
                { required: true, message: 'Please select imported date!' },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                defaultValue={dayjs()}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="expiredDate"
              label="Expired date"
              className="font-medium"
              dependencies={['importedDate']} // depends on importedDate field
              rules={[
                { required: true, message: 'Please select expired date!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const importedDate = getFieldValue('importedDate');
                    if (!value || !importedDate) {
                      return Promise.resolve();
                    }
                    if (dayjs(value).isBefore(dayjs(importedDate))) {
                      return Promise.reject(
                        new Error(
                          'Expired date cannot be earlier than imported date!'
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="importedPrice"
              label="Imported price"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter imported price!' },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === null || value === '') {
                      return Promise.reject('Imported price is required!');
                    }
                    if (isNaN(value)) {
                      return Promise.reject('Imported price must be a number!');
                    }
                    if (value < 0) {
                      return Promise.reject(
                        'Imported price cannot be negative!'
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="supplierName"
              label="Supplier name"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter supplier name!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="description"
              label="Description"
              className="font-medium"
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 ml-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmit}
              size="large"
              shape="round"
              className="w-full sm:w-auto"
              icon={<PlusOutlined />}
            >
              Create new item
            </Button>
            <Button
              danger
              size="large"
              shape="round"
              onClick={() => setShowWarehouseNew(false)}
              className="w-full sm:w-auto"
              icon={<CloseOutlined />}
            >
              Cancel
            </Button>
          </div>
        </Row>
      </Form>
    </>
  );
};

export default WarehouseNew;
