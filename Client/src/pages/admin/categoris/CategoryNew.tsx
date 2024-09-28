import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification, Space, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  callAddNewCategory,
  callGetAllCategory,
} from '../../../services/serverApi';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
interface CategoryNewProps {
  onAddSuccess: () => void;
  setShowCategoryNew: (value: boolean) => void;
}

const CategoryNew: React.FC<CategoryNewProps> = ({
  onAddSuccess,
  setShowCategoryNew,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const [allCategory, setAllCategory] = useState([]);

  const fetchCategories = async () => {
    const responseAllCategory = await callGetAllCategory('');
    if (responseAllCategory?.status === 200) {
      setAllCategory(responseAllCategory.data._embedded.categoryResponseList);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  console.log('allCategory:', allCategory);
  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      const { name, description, children, status } = values;
      console.log('values:', values);
      const parentResponse = await callAddNewCategory(
        name,
        name
          .toLowerCase()
          .normalize('NFD') // Chuyển đổi ký tự có dấu thành tổ hợp ký tự
          .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu
          .replace(/\s+/g, '-'), // Thay thế khoảng trắng bằng dấu gạch ngang
        status,
        null,
        description
      );
      console.log('parentResponse:', parentResponse);

      if (parentResponse?.status === 200) {
        notification.success({
          message: 'Đã tạo danh mục cha thành công!',
          duration: 5,
          showProgress: true,
        });

        // Tạo các danh mục con nếu có
        if (children && children.length > 0) {
          for (const child of children) {
            const childResponse = await callAddNewCategory(
              child.name,
              child.name.toLowerCase().replace(/\s+/g, '-'),
              status,
              parentResponse.data.id,
              child.description
            );

            if (childResponse.status !== 200) {
              notification.warning({
                message: 'Tạo danh mục con thất bại',
                description: `Không thể tạo danh mục con "${child.name}"`,
                duration: 5,
                showProgress: true,
              });
            }
          }
        }

        notification.success({
          message: 'Đã tạo danh mục và các danh mục con thành công!',
          duration: 5,
          showProgress: true,
        });
        form.resetFields();
        onAddSuccess();
      } else {
        notification.error({
          message: 'Tạo danh mục thất bại',
          description: 'Đã xảy ra lỗi khi tạo danh mục cha!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Lỗi khi tạo danh mục',
        description: error.message,
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
        Create New Category
      </h4>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'ACTIVE' }}
      >
        <Form.Item
          className="font-medium"
          label="Category Name"
          name="name"
          rules={[
            { required: true, message: 'Please input the category name!' },
          ]}
        >
          <Input className="" placeholder="Category Name" />
        </Form.Item>
        <Form.Item
          className="font-medium"
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea rows={2} placeholder="Description" />
        </Form.Item>

        <Form.Item
          className="font-medium"
          label="Status"
          name="status"
          valuePropName="checked"
          rules={[{ required: true, message: 'Please input the status!' }]}
        >
          <Switch
            loading={isSubmit}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            defaultChecked
            onChange={(checked) => {
              const status = checked ? 'ACTIVE' : 'INACTIVE';
              console.log('Status:', status);
            }}
          />
        </Form.Item>

        {/* <Form.List name="children">
          {(fields, { add, remove }) => (
            <>
              <label className="block text-lg font-medium mb-2">
                Subcategories
              </label>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  align="baseline"
                  className="mb-4 flex flex-wrap gap-4"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: 'Please input the subcategory name!',
                    //   },
                    // ]}
                    className="flex-1"
                  >
                    <Input placeholder="Subcategory Name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: 'Please input the subcategory description!',
                    //   },
                    // ]}
                    className="flex-1"
                  >
                    <Input placeholder="Subcategory Description" />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    className="text-red-500"
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  className="w-full"
                >
                  Add Subcategory
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List> */}

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            size="large"
            loading={isSubmit}
            className="w-full sm:w-auto"
            icon={<SaveOutlined />}
          >
            Save Category
          </Button>
          <Button
            danger
            size="large"
            shape="round"
            onClick={() => setShowCategoryNew(false)}
            className="w-full sm:w-auto"
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </>
  );
};

export default CategoryNew;
